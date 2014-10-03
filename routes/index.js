var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('welcome_login', { title: 'Welcome' });
});

var register = require("./register.js");
router.post("/register", register.registerNewUser);
router.get("/register", register.renderRegPage);

var login = require("./login.js");
router.post("/login", login.login);

module.exports = router;
