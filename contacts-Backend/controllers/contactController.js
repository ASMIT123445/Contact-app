 const asyncHandler = require("express-async-handler"); 
 const Contact = require("../models/contactModel");

 //@desc GET all contacts
 //@route GET /api/contacts
 //@access private
 const getContact = asyncHandler(async(req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

 //@desc GET single contact by ID
 //@route GET /api/contacts/:id
 //@access private
 const getContacts = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

 //@desc Create new contact
 //@route POST /api/contacts
 //@access private
 const createContacts = asyncHandler(async(req, res) => {
    console.log("The body example for create in JSON is ", req.body);
    const {name, email, phone} = req.body;
    if (!name || !email || !phone) {  
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const existingContacts = await Contact.findOne({
        user_id: req.user.id,
        phone: phone,
    });

    if (existingContacts) {
        return res.status(400).json({
            message: "Phone number already exists."
        });
    };
    const contact = await Contact.create({ name, email, phone, user_id: req.user.id,  });
    res.status(201).json(contact);
});

 //@desc UPDATE contact by ID
 //@route PUT /api/contacts/:id
 //@access private
 const updateContacts = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString()!= req.user.id) {
        res.status(403);
        throw new Error("User dont have access to update other users contact.");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedContact);
});

 //@desc DELETE contact by ID
 //@route DELETE /api/contacts/:id
 //@access private
 const deleteContacts = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString()!= req.user.id) {
        res.status(403);
        throw new Error("User dont have access to update other users contact.");
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(contact);
});

module.exports = {getContact, getContacts, createContacts, updateContacts, deleteContacts};