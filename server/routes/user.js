var express = require('express');
var router = express.Router();

// User Controller
var user = require('../controllers/user');

/* GET users listing. */
router.get('/', user.example);

module.exports = router;
