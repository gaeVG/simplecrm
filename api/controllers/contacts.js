const db = require("mongoose");
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

        model.create(
            { 
                userId: request.cookies.jwtData.id,
                name: name,
                email: email,
                description: description,
                category: category
            }
        );
    
    } catch (error) {

        return response.status(400).json(
            {
                error: error
            }
        )
    }

    response.json(
        {
            contact: request.body
        }
    )
}
const delContact = async (request, response) => {

    if (Object.entries(request.body).length === 0) {

        return response.status(400).json(
            {
                message: "No argument provided"
            }
        )
    }
    console.log(request.body.name)
    const result = await model.findOne(request.body)
    console.log(result)
    if (!result) {

        return response.status(404).json(
            {
                message: "No contact could be found"
            }
        )
    }

    response.json(
        {
            contact: "del contact"
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
            response.json(
                {
                    data: result,
                    nb: result.length
                }
            );

    } else {
        const result = await model.findOne(request.query).populate("userId");

        console.log(result)
    }
}
const updateContact = async (_, response) => {

    response.json(
        {
            contact: "update"
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