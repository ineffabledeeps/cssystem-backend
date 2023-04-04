var express = require("express");
var router = express.Router();

messageRoute = require("../controllers/testAPIControllers")

router.post("/getuser",messageRoute.getUserController);
router.post("/register",messageRoute.registerUserController)

module.exports = router;