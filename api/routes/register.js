const express = require("express");
const router = express.Router();

const controller = require("../controllers/users");


router.post("/",
    controller.checkUser(),
    controller.validateUser,
    controller.createUser
);


module.exports = router;
