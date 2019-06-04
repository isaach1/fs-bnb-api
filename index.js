const express = require("express");
// const logger = require("./src/utilities/middleware/logger");

const app = express();

// app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// app.use("/users", require("./src/api/users-routes"));

var users = new Array();
var properties = new Array();
var bookings = new Array();

// adds a new user
app.post("/users", (req, res) => {
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

// checks that a user can login from the login credentials given
app.post("/users/authentication", (req, res) => {
    const user = req.body;
    const bodyEmail = user.email;
    const bodyPassword = user.password;

    if (!bodyEmail) {
        return res.status(400).json({message: "Invalid email"});
    }
    if (!bodyPassword) {
        return res.status(400).json({message: "Invalid password"});
    }

    var foundUser = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].email == bodyEmail && users[i].password == bodyPassword) {
            foundUser = users[i];
        }
    }
    if (foundUser) {
        res.json(foundUser);
    } else {
        return res.status(400).json({ message: "User is not in the database"});
    }

});

// creates a new property
app.post("/properties", (req, res) => {
    const property = req.body;
    const bodyName = property.name;
    const bodyLocation = property.location;
    const bodyImageUrl = property.imageUrl;
    const bodyPrice = property.price;
    
    if (!bodyName) {
        return res.status(400).json({message: "Invalid name"});
    }
    if (!bodyLocation) {
        return res.status(400).json({message: "Invalid location"});
    }
    if (!bodyImageUrl) {
        return res.status(400).json({message: "Invalid image"});
    }
    if (!bodyPrice || (typeof bodyPrice !== "number")) {
        return res.status(400).json({message: "Invalid price"});
    }

    var newProperty = {
        id: properties.length + 1,
        name: bodyName,
        location: bodyLocation,
        imageUrl: bodyImageUrl,
        price: bodyPrice
    };
    properties.push(newProperty);
    res.json(newProperty);
});

// deletes a property 
app.delete("/properties/:id", (req, res) => {
    var id = req.params.id;
    const index = properties
        .filter(property => property.id == id)
        .map(property => properties.indexOf(property));
    properties.splice(index, 1);
    res.send("DELETE request to properties/:$id");
});

// retreives the information for a given property id
app.get("/properties/:id", (req, res) => {
    const id = req.params.id;
    const parsePropertyId = parseInt(id);
    if (isNaN(parsePropertyId)) {
        return res.status(400).json({ message: "Integer Expected" });
    }
    if (!id) {
        return res.status(400).json({ message: "Please pass in a property ID" })
    }
    
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].id == id) {
            return res.status(200).json(properties[i]);
        }
    }

    return res.status(400).json({ message: "Property not found"});
});

// creates a new booking request
app.post("/properties/:id/bookings", (req, res) => {
    var booking = req.body;
    const propId = req.params.id;
    const bodyDateFrom = booking.dateFrom;
    const bodyDateTo = booking.dateTo;
    const bodyUserId = booking.userId;

    // if (!bodyDateFrom || (typeof bodyDateFrom !== "date")) {
    //     return res.status(400).json({message: "Invalid starting date"});
    // }
    // if (!bodyDateTo || (typeof bodyDateTo !== "date")) {
    //     return res.status(400).json({message: "Invalid ending date"});
    // }
    if (!bodyUserId || (typeof bodyUserId !== "number")) {
        return res.status(400).json({message: "Invalid user ID"});
    }
    if(propId > properties.length) {
        return res.status(400).json({ message: "This property does not exist" });
    }

    var newBooking = {
        id: bookings.length + 1,
        dateFrom: bodyDateFrom,
        dateTo: bodyDateTo,
        userId: bodyUserId,
        propertyId: propId,
        status: "NEW"
    };

    bookings.push(newBooking);
    res.json(newBooking);
});

// retrieves a booking request by property by id
app.get("/properties/:id/bookings", (req, res) => {
    const propId = req.params.id;
    var propertyBookings = new Array();

    if (propId > bookings.length) {
        return res.status(400).json({ message: "This property does not exist"});
    }
    
    for (var i = 0; i < bookings.length; i++) {
        if (propId == bookings[i].propertyId) {
            propertyBookings.push(bookings[i]);
        }
    }

    if (propertyBookings.length == 0) {
        return res.status(400).json({ message: "No bookings exist for this property"});
    } else {
        res.json(propertyBookings);
    }
});


app.listen(3000, () => {
    console.log("Server running")
});