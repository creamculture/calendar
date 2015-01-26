//This file serves up different pages and directs other request 
//types when necessary

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('welcome_login');

});

//Handle requests to the calendar controller
var calendar = require("./calendar.js");
router.get("/calendar", calendar.renderCalendarPage);

//Handle requests to the userDashboard controller
var userDashboard = require("./userDashboard.js");
router.get("/dashboard", userDashboard.renderUserDashboard);
router.post("/event", userDashboard.saveNewEvent);
router.get("/event", userDashboard.getEvents);


//Handle requests to register controller functions
var register = require("./register.js");
router.post("/register", register.registerNewUser);
router.get("/register", register.renderRegPage);


//Handle requests to login controller functions
var login = require("./login.js");
router.post("/login", login.login);


module.exports = router;