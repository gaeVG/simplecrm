const express = require("express");
const router = express.Router();

const userController = require("../controllers/users")
const contactController = require("../controllers/contacts")


router.get("/", userController.checkUser, contactController.getContact)
router.post("/", userController.checkUser, contactController.addContact)
router.put("/", userController.checkUser, contactController.updateContact)
router.delete("/", userController.checkUser, contactController.delContact)


module.exports = router