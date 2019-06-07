var mysqlConn = require("../database/database");

var User = function(user) {
  
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
};

User.createUser = function(newUser, result) {
    mysqlConn.query("INSERT INTO user set ?", newUser, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(result);
            result(null, res.insertId);
        }
    });
};

User.getAllUsers = function(result) {
    mysqlConn.query("Select * from user", function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log("Users : ", res);
            result(null, res);
        }
    });
};

User.getUserByEmail = function(userEmail, result) {
    mysqlConn.query("Select * from user where email = ?", userEmail, function(err,res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

User.updateUserById = function(userId, user, result) {
    mysqlConn.query(
        "UPDATE user SET user = ? WHERE id = ?",
        [user, userId],
        function(err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        });
};

User.removeUser = function(userId, result) {
    mysqlConn.query("DELETE FROM user WHERE id = ?", userId, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = User;
