var mysqlConn = require("../database/db");

var Property = function(property) {
  
    this.firstname = property.firstname;
    this.lastname = property.lastname;
    this.email = property.email;
    this.password = property.password;
};

Property.createProperty = function(newProperty, result) {
    mysqlConn.query("INSERT INTO property set ?", newProperty, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

Property.getAllProperties = function(result) {
    mysqlConn.query("Select * from property", function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log("Properties : ", res);
            result(null, res);
        }
    });
};

Property.getPropertyById = function(propertyId, result) {
    mysqlConn.query("Select * from property where id = ? ", propertyId, function(err,res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Property.updatePropertyById = function(propertyId, property, result) {
    mysqlConn.query(
        "UPDATE property SET property = ? WHERE id = ?",
        [property, propertyId],
        function(err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        });
};

Property.removeProperty = function(propertyId, result) {
    mysqlConn.query("DELETE FROM property WHERE id = ?", propertyId, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = Property;
