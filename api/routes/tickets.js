var express = require("express");
var router = express.Router();

ticketRoute = require("../controllers/testAPIControllers")

router.post("/get",ticketRoute.getTicketsController);
router.post("/mark",ticketRoute.markTicketsController);
router.post("/connect",ticketRoute.connectTicketsController);

module.exports = router;