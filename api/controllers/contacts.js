const db = require("mongoose");


const addContact = async (_, response) => {

    response.json(
        {
            contact: "add contact"
        }
    )
}
const delContact = async (_, response) => {

    response.json(
        {
            contact: "del contact"
        }
    )
}
const getContact = async (request, response) => {
    console.log(request.cookie.jwtData.id)
    response.json(
        {
            contact: "get contact"
        }
    )
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
    delContact,
    getContact,
    updateContact
}