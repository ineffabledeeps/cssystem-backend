var express = require("express");
var router = express.Router();

testRoute = require("../controllers/testAPIControllers")

router.get("/",testRoute.testAPIController);
router.post("/",testRoute.testAPIController);

module.exports = router;