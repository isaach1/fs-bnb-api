const express = require("express");
const router = express.Router();

var users = new Array();

router.post("/", (req, res) => {
    const user = req.body;
    const bodyFirstname = user.firstname;
    const bodyLastname = user.lastname;
    const bodyEmail = user.email;
    const bodyPassword = user.password;
    
    if (!bodyFirstname) {
        return res.status(400).json({message: "Invalid first name"});
    }
    if (!bodyLastname) {
        return res.status(400).json({message: "Invalid last name"});
    }
    if (!bodyEmail) {
        return res.status(400).json({message: "Invalid email"});
    }
    if (!bodyPassword) {
        return res.status(400).json({message: "Invalid password"});
    }
    
    var newUser = {
        id: users.length + 1,
        firstname: bodyFirstname,
        lastname: bodyLastname,
        email: bodyEmail,
        password: bodyPassword
    };

    var already_in = false;
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == bodyEmail) {
            already_in = true;
        }
    }
    if (already_in == true) {
        return res.status(400).json({ message: "This email is already used"});
    } else {
        users.push(newUser);
        res.json(newUser);
    }
});