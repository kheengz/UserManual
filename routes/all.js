var express = require('express');
var router = express.Router();

//Require middlewares here
// var isVerified = require('../middlewares/isVerified');
var isAuthenticated = require('../middlewares/isAuthenticated');
// var hasRole = require('../middlewares/hasRole');
// router.use(isVerified);
router.use(isAuthenticated);
// router.use(hasRole);

//Require routes here
var pagesRoutes = require('../routes/pages');
var listBoxRoutes = require('../routes/list-boxes');

pagesRoutes(router);
listBoxRoutes(router);

module.exports = router;
