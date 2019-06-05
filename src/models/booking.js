var mysqlConn = require("../database/database");

var Booking = function(booking) {
  
    this.firstname = booking.firstname;
    this.lastname = booking.lastname;
    this.email = booking.email;
    this.password = booking.password;
};

Booking.createBooking = function(newBooking, result) {
    mysqlConn.query("INSERT INTO booking set ?", newBooking, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

Booking.getAllBookings = function(result) {
    mysqlConn.query("Select * from booking", function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log("Bookings : ", res);
            result(null, res);
        }
    });
};

Booking.getBookingById = function(bookingId, result) {
    mysqlConn.query("Select * from booking where id = ? ", bookingId, function(err,res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Booking.updateBookingById = function(bookingId, booking, result) {
    mysqlConn.query(
        "UPDATE booking SET booking = ? WHERE id = ?",
        [booking, bookingId],
        function(err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                result(null, res);
            }
        });
};

Booking.removeBooking = function(bookingId, result) {
    mysqlConn.query("DELETE FROM booking WHERE id = ?", bookingId, function(err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

module.exports = Booking;
