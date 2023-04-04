var express = require("express");
var router = express.Router();

messageRoute = require("../controllers/testAPIControllers")

//router.get("/",messageRoute.getMessageController);
router.post("/get",messageRoute.getMessageController);
router.post("/send",messageRoute.sendMessageController);

module.exports = router;