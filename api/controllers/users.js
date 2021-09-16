const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');

const Users = require("../schemas/users");
const Contacts = require("../schemas/contacts");
const passwordValidator = require("password-validator");
const { response } = require("express");


const checkAdmin = async (request, response, next) => {

	const result = await Users.find({})
	
	const isAdmin =result.filter(user => user.id === request.cookies.jwtData.id && user.group === "admin")

	if (isAdmin.length === 0) {

		return response.status(401).json(
			{
				message: "Not allowed"
			}
		)
	}

	next()
}
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
	
	const user = await Users.findOne({ email });
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
			message: "Authorized connection",
		}
	);
}
const createUser = async (request, response) => {

	const { email, password } = request.body;

	try {
		
		const hashedPassword = await bcrypt.hash(password, 12);

		await Users.create({ email : email, password: hashedPassword, group: "user" });
		
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
const deconnectUser = async (_, response) => {

	response.clearCookie("jwt")

	response.status(200).json(
		{
			message: "Déconnexion"
		}
	)
}
const deleteUser = async (request, response) => {

	const user = await Users.findOneAndDelete(request.body)

	if (!user) {

		return response.status(404).json(
			{
				message: "No user could be found"
			}
		)
	}

	const contacts = await Contacts.find({})

	contacts.map(async contact => {

		if (contact.userId == user.id) {

			await Contacts.findByIdAndDelete(contact.id)
		}
	})

	response.json(
		{
			user: user
		}
	)
}
const getUsers = async (request, response) => {

	const result = await Users.find({})

	response.json(
		{
			users: result
		}
	)
}
const validateUser = (request, response, next) => {

    const errors = validationResult(request)

    if (!errors.isEmpty()) {

        return response.status(422).json(
            {
                errors: errors.array()
            }
        )
    }

    next()
}


module.exports ={
	checkAdmin,
	checkToken,
	checkUser,
	connectUser,
    createUser,
	deconnectUser,
	deleteUser,
	getUsers,
	validateUser,
}
