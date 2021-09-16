const express = require("express");
const router = express.Router();

const controller = require("../controllers/users");


router.get("/",
    controller.checkToken,
    controller.checkAdmin,
    controller.getUsers
);
router.delete("/",
    controller.checkToken,
    controller.checkAdmin,
    controller.deleteUser
)


module.exports = router;
