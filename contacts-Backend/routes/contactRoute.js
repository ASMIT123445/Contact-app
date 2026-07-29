const express = require("express");
const { getContacts, createContacts, updateContacts, deleteContacts, getContact } = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();


router.use(validateToken);

router.route("/").get(getContact).post(createContacts);

router.route("/:id").get(getContacts);

router.route("/:id").put(updateContacts);

router.route("/:id").delete(deleteContacts);

module.exports = router; 