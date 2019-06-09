const express = require("express");
const User = require("./src/models/user");
const Property = require("./src/models/property");
const Booking = require("./src/models/booking");
const Provider = require("./src/models/provider");
const cors = require('cors');
// const logger = require("./src/utilities/middleware/logger");

const app = express();

// app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cors());

// app.use("/users", require("./src/api/users-routes"));

// var users = new Array();
// var properties = new Array();
// var bookings = new Array();

// adds a new user
app.post("/users", (req, res) => {
    const user = req.body;
    const bodyFirstname = user.firstname;
    const bodyLastname = user.lastname;
    const bodyEmail = user.email;
    const bodyPassword = user.password;
    const bodyRole = user.role;
    
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
    if (!bodyRole) {
        return res.status(400).json({message: "Invalid role"});
    }
    
    
    User.createUser(user, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({message: err.sqlMessage});
            } else {
                return res.status(500).json({message: "Failed to insert, try again"});
            }
        }
        return res.status(200).json({id: result});
    });
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

    User.getUserByEmail(bodyEmail, (err, result) => {
        if (err || result.length == 0) {
            return res.status(404).json({message: "User not found"});
        } else if (!err) {
            if (result[0].password === bodyPassword) {
                const userResponse = {
                    id: result[0].id,
                    firstname: result[0].firstname,
                    lastname: result[0].lastname,
                    email: result[0].email
                };
                return res.json(userResponse); 
            } else {
                return res.status(404).json({message: "Incorrect password please try again"});
            }
        }
    });
});

// returns profile of user with given id
app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    const parseUserId = parseInt(id);
    if (isNaN(parseUserId)) {
        return res.status(400).json({ message: "Integer Expected" });
    }
    if (!id) {
        return res.status(400).json({ message: "Please pass in a user ID" })
    }
    
    User.getUserById(parseUserId, (err, result) => {
        if (err || result.length == 0) {
            return res.status(400).json({message: "User not found"});
        } else {
            res.json(result);
        }
    });
});

// creates a new provider 
app.post("/providers", (req, res) => {
    const provider = req.body;
    const bodyFirstname = provider.firstname;
    const bodyLastname = provider.lastname;
    const bodyEmail = provider.email;
    const bodyPassword = provider.password;
    const bodyRole = provider.role;
    
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
    if (!bodyRole) {
        return res.status(400).json({message: "Invalid role"});
    }
    
    
    Provider.createProvider(provider, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({message: err.sqlMessage});
            } else {
                return res.status(500).json({message: "Failed to insert, try again"});
            }
        }
        return res.status(200).json({id: result});
    });
});

// checks that a provider can login from the login credentials given
app.post("/providers/authentication", (req, res) => {
    const provider = req.body;
    const bodyEmail = provider.email;
    const bodyPassword = provider.password;

    if (!bodyEmail) {
        return res.status(400).json({message: "Invalid email"});
    }
    if (!bodyPassword) {
        return res.status(400).json({message: "Invalid password"});
    }

    Provider.getProviderByEmail(bodyEmail, (err, result) => {
        if (err || result.length == 0) {
            return res.status(404).json({message: "Provider not found"});
        } else if (!err) {
            if (result[0].password === bodyPassword) {
                const providerResponse = {
                    id: result[0].id,
                    firstname: result[0].firstname,
                    lastname: result[0].lastname,
                    email: result[0].email
                };
                return res.json(providerResponse); 
            } else {
                return res.status(404).json({message: "Incorrect password please try again"});
            }
        }
    });
});

// returns the details for a given provider
app.get("/providers/:id", (req, res) => {
    const id = req.params.id;
    const parseProviderId = parseInt(id);
    if (isNaN(parseProviderId)) {
        return res.status(400).json({ message: "Integer Expected" });
    }
    if (!id) {
        return res.status(400).json({ message: "Please pass in a user ID" })
    }
    
    Provider.getProviderById(parseProviderId, (err, result) => {
        if (err || result.length == 0) {
            return res.status(400).json({message: "User not found"});
        } else {
            // console.log(result);
            res.json(result);
        }
    });
});

// creates a new property
app.post("/properties", (req, res) => {
    const property = req.body;
    const bodyName = property.name;
    const bodyLocation = property.location;
    const bodyImageUrl = property.imageUrl;
    const bodyPrice = property.price;
    const bodyProviderId = property.providerId;
    
    if (!bodyName) {
        return res.status(400).json({message: "Invalid name"});
    }
    if (!bodyLocation) {
        return res.status(400).json({message: "Invalid location"});
    }
    if (!bodyImageUrl) {
        return res.status(400).json({message: "Invalid image"});
    }
    if (!bodyPrice || (typeof bodyPrice !== "string")) {
        return res.status(400).json({message: "Invalid price"});
    }
    if (!bodyProviderId || (typeof bodyProviderId !== "string")) {
        return res.status(400).json({message: "Invalid provider ID"});
    }

    Property.createProperty(property, (err, result) => {
        return res.status(200).json({id: result});
    });
});

// returns all properties in the database
app.get("/properties", (req, res) => {
    Property.getAllProperties(result => {
        console.log(result);
        return res.json(result);
    });
});

// returns all properties for a given provider ID
app.get("/properties/all/:id", (req, res) => {
    var providerId = req.params.id;
    const parseProviderId = parseInt(providerId);
    if (isNaN(parseProviderId)) {
        return res.status(400).json({ message: "Integer Expected" });
    }
    if (!providerId) {
        return res.status(400).json({ message: "Please pass in a provider ID" })
    }
    Property.getPropertyByProviderId(parseProviderId, (err, result) => {
        console.log(result);
        res.json(result);
    });
});

// deletes a property 
app.delete("/properties/:id", (req, res) => {
    var id = req.params.id;
    Property.removeProperty(id, (err, result) => {
        res.json(result);
    });
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
    
    Property.getPropertyById(parsePropertyId, (err, result) => {
        res.json(result);
    });
});

// // updates information for a given property
// app.patch("/properties", (req, res) => {

// })

// creates a new booking request
app.post("/properties/:id/bookings", (req, res) => {
    var booking = req.body;
    const bodyDateFrom = booking.dateFrom;
    const bodyDateTo = booking.dateTo;
    const bodyUserId = booking.userId;
    const propId = req.params.id;
    const bodyStatus = booking.status;

    // if (!bodyDateFrom || (typeof bodyDateFrom !== "date")) {
    //     return res.status(400).json({message: "Invalid starting date"});
    // }
    // if (!bodyDateTo || (typeof bodyDateTo !== "date")) {
    //     return res.status(400).json({message: "Invalid ending date"});
    // }
    if (!bodyUserId || (typeof bodyUserId !== "string")) {
        return res.status(400).json({message: "Invalid user ID"});
    }
    if (!propId) {
        return res.status(400).json({message: "Invalid property ID"});
    }
    if (!bodyStatus) {
        return res.status(400).json({message: "Invalid status"});
    }

    const newBooking = {
        dateFrom: booking.dateFrom,
        dateTo: booking.dateTo,
        userId: booking.userId,
        propertyId: req.params.id,
        status: booking.status
    };
    
    Booking.createBooking(newBooking, (err, result) => {
        return res.status(200).json({id: result});
    });
});

// retrieves a booking request by property by id
app.get("/properties/:id/bookings", (req, res) => {
    const propId = req.params.id;
    Booking.getBookingsByPropertyId(propId, (err, result) => {
        res.json(result);
    });
});


app.listen(3000, () => {
    console.log("Server running")
});