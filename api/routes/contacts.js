const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const contactController = require("../controllers/contacts");


router.get("/",
    userController.checkToken,
    contactController.getContacts
);
router.post("/",
    userController.checkToken,
    contactController.checkContact(),
    contactController.validateContact,
    contactController.addContact
);
router.put("/",
    userController.checkToken,
    contactController.updateContact
);
router.delete("/",
    userController.checkToken,
    contactController.delContact
);


module.exports = router;
