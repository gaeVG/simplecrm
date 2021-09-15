const express = require("express");
const router = express.Router();

const controller = require("../controllers/users");


router.post("/", controller.connectUser);


module.exports = router;
