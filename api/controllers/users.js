const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');

const model = require("../schemas/users");
const passwordValidator = require("password-validator")

const checkUser = () => [

	body("email").isString().trim(),
	body("password").custom( (value) => {
		const password = new passwordValidator()

		password
			.is().min(6).max(32)
			.has().uppercase().has().lowercase()
			.has().digits(1)
			.has().not().spaces()

		return password.validate(value)
	})
]

const checkToken = async (request, response, next) => {

	try {
		const data = jwt.verify(request.cookies.jwt, process.env.JWT_HASH);

		request.cookies.jwtData = data;
		next();

	} catch (err) {

		return response.status(401).json(
            {
			    message: "Your token is not valid",
		    }
        );
	}
}
const connectUser = async (request, response) => {

	const { email, password } = request.body;

	if (!email || !password) {
		
		response.status(400).json(
			{
				message: "The email address or the password is missing"
			}
		);
		
		return
	}
	
	const user = await model.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!user || !isPasswordValid) {

		return response.status(400).json(
            {
			    message: "Invalid email or password",
		    }
        );
	}

	const token = jwt.sign({ id: user._id }, process.env.JWT_HASH);

	response.cookie("jwt", token, { httpOnly: true, secure: false });

	response.json(
		{
			message: "Here is your cookie for subsequent requests, have fun :)",
		}
	);
}
const createUser = async (request, response) => {

	const { email, password } = request.body;

	try {

		if (!(/\d/.test(password))) throw "number"

		const hashedPassword = await bcrypt.hash(password, 12);

		await model.create({ email : email, password: hashedPassword });
		
	} catch (error) {
		
		if (error == "number") {

			return response.status(400).json({
				message: "The password must contain at least one number",
			});

		} else {

			return response.status(400).json({
				message: "This user already exists",
			});
		}
		
	}

	response.status(201).json(
        {
		    message: `User created with email: ${email}`,
	    }
    );
}
const getUser = async (request, response) => {

    console.log("Utilisateur qui fait la requête :", request.cookies.jwtData.id);

    response.json(
        {
            message: "You are authorized",
        }
    );
}


module.exports ={
	checkToken,
	connectUser,
    createUser,
    getUser
}