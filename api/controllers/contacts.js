const { body, validationResult } = require('express-validator');

const model = require("../schemas/contacts")

const checkContact = () => [

    body("name").isString().trim(),
    body("email").isEmail(),
    body("description").isString().trim(),
    body("category").isInt()
];
const validateContact = (request, response, next) => {

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
const addContact = async (request, response) => {

    const { name, email, description, category } =request.body

    try {

        const result = await model.create(
            { 
                userId: request.cookies.jwtData.id,
                name: name,
                email: email,
                description: description,
                category: category
            }
        );

        response.status(200).json(
            {
                contact: result
            }
        )
    
    } catch (error) {

        return response.status(400).json(
            {
                error: error
            }
        )
    }
}
const delContact = async (request, response) => {

    if (Object.entries(request.body).length === 0) {

        return response.status(400).json(
            {
                message: "No argument provided"
            }
        )
    }

    const result = await model.findOneAndDelete(request.body)

    if (!result) {

        return response.status(404).json(
            {
                message: "No contact could be found"
            }
        )
    }

    response.status(200).json(
        {
            contact: result
        }
    )
}
const getContacts = async (request, response) => {

    if (Object.entries(request.query).length === 0) {

        const result = await model.find().populate("userId");

        result.length === 0
        ?
            response.status(404).json(
                {
                    data: []
                }
            )
        :
            response.status(200).json(
                {
                    data: result,
                    nb: result.length
                }
            );

    } else {

        if (Object.entries(request.query).length > 1) {

            return response.status(400).json(
                {
                    message: "You can only send one request at a time"
                }
            )
        }

        const result = await model.findOne(request.query).populate("userId");

        if (!result) {

            return response.status(404).json(
                {
                    message: "No one could be found with this request"
                }
            )
        }

        response.status(200).json(
            {
                contact: result
            }
        )
    }
}
const updateContact = async (request, response) => {

    if (!request.body.hasOwnProperty("email")) {

        return response.status(400).json(
            {
                message: "The email address of the contact is necessary for its update"
            }
        )
    }

    const result = await model.findOneAndUpdate({ email : request.body.email }, request.body).populate("userId");

    if (!result) {

        return response.stats(404).json(
            {
                messsage: "The contact we are looking for cannot be found"
            }
        )
    }

    response.json(
        {
            update: request.body
        }
    )
}

module.exports = {
    addContact,
    checkContact,
    delContact,
    getContacts,
    updateContact,
    validateContact
}
