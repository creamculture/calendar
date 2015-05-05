//This file serves up different pages and directs other request 
//types when necessary. Client requests' first stop.

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('welcome_login');
});

//Handle requests to the magazine controller
var magazine = require("./magazine.js");
router.get("/magazine", magazine.renderMagazinePage);

//Handle requests to the calendar controller
var calendar = require("./calendar.js");
router.get("/calendar", calendar.renderCalendarPage);

//Handle requests to the userDashboard controller
var userDashboard = require("./userDashboard.js");
router.get("/dashboard", userDashboard.renderUserDashboard);
router.post("/event", userDashboard.saveNewEvent);
router.get("/event", userDashboard.getEvents);

<<<<<<< HEAD
//Profile pic load/upload/crop functions
router.post("/api/uploadProfilePicture", userDashboard.uploadProfilePicture);
router.post("/api/cropProfilePicture", userDashboard.cropProfilePicture);
router.get("/api/getProfilePicture", userDashboard.getProfilePicture);

=======
router.post("/api/uploadEventPhoto", userDashboard.uploadEventPhoto);
router.post("/api/cropEventPhoto", userDashboard.cropEventPhoto);
router.get("/api/getEventPhoto/:eventId*?", userDashboard.getEventPhoto);
>>>>>>> create-event

//Handle requests to register controller functions
var register = require("./register.js");
router.post("/register", register.registerNewUser);
router.get("/register", register.renderRegPage);


//Handle requests to login controller functions
var login = require("./login.js");
router.post("/login", login.login);

router.get('/test', function(req, res) {
	res.send(req.session.username);
});


module.exports = router;
