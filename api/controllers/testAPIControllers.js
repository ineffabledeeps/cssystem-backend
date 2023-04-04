const url = "mongodb://127.0.0.1:27017/cssystem";
const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models");
const crypto = require("crypto");
mongoose.connect(
  url,

  {
    useNewUrlParser: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

async function getUsername(token) {
  const user = await userModel.userauth.find({authToken:token});
  //console.log(user[0]["userName"])
  return user[0]['userName'];
}

async function getChannel(token) {
  var user = await getUsername(token);
  var receiver;
  const msg_channel = await userModel.tickets.find({
    $or: [{ resolver: user }, { generator: user }],
    ticketStatus: "open",
  });
  if (msg_channel.length != 0) {
    if (msg_channel[0]["generator"] == user) {
      receiver = msg_channel[0]["generator"];
    } else {
      receiver = msg_channel[0]["resolver"];
    }
    //console.log(msg_channel[0]["resolver"], msg_channel[0]["generator"]);
    return receiver, msg_channel[0]["ticketNumber"];
  } else return null;
}

function generateAuthToken() {
  try {
    var auth_token = crypto.randomBytes(64).toString("hex");
    return auth_token;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function generateMessageId() {
  const str = "msg_";
  var counter = 0;
  var no, msg;

  while (true) {
    msg = str + counter.toString();
    no = await userModel.messages.find({ messageId: msg });
    if (no.length == 0) {
      //console.log("break in effect");
      break;
    }
    counter = counter + 1;
  }
  //console.log(msg);
  return msg;
}

async function generateTicketNo() {
  const str = "tic_";
  var counter = 0;
  var no, ticket;

  while (true) {
    ticket = str + counter.toString();
    no = await userModel.tickets.find({ ticketNumber: ticket });
    if (no.length == 0) {
      //console.log("break in effect");
      break;
    }
    counter = counter + 1;
  }
  //console.log(ticket);
  return ticket;
}

async function generateTicket(username, query) {
  const ticket = new userModel.tickets({
    ticketNumber: await generateTicketNo(),
    ticketStatus: "open",
    ticketQuery: query,
    generator: username,
    resolver: null,
  });

  await ticket.save();
}

exports.testAPIController = (req, res) => {
  res.json({
    token: "123",
  });
};

exports.getMessageController = async (req, res) => {

  console.log(req.body.token)
const msgChannel = await getChannel(req.body.token);
const messages = await userModel.messages.find({ linkedTo: msgChannel });
  //console.log(messages);
  res.status(200).send({messages});
};

exports.sendMessageController = async (req, res) => {
  const username = await getUsername(req.body.token);
  const token = req.body.token;
  var receiver,
    msgChannel = await getChannel(token);
  if (!msgChannel) {
    await generateTicket(username, req.body.message);
    receiver, (msgChannel = await getChannel(token));
  }

  if (!receiver) {
    receiver = null;
  }

  //console.log(receiver, msgChannel);
  console.log(req.body.message)

  const message = new userModel.messages({
    messageId: await generateMessageId(),
    linkedTo: msgChannel,
    sender: username,
    status: "delivered",
    receiver: receiver,
    message: req.body.message,
  });

  await message.save();
  res.status(200).send();

  //username = await getUsername(req.body.token);
  //console.log(username);
};

exports.registerUserController = async (req, res) => {
  const username = req.body.userName;
  //console.log(username)
  const user = new userModel.users({
    userName: req.body.userName,
    userRole: req.body.userRole,
  });

  const users = await userModel.users.find({ userName: username });
  // const auth = await userModel.userauth.find({ userName: username});
  //console.log(users.length)
  try {
    if (users.length == 0) {
      authToken = generateAuthToken();
      if (authToken) {
        const auth = new userModel.userauth({
          userName: username,
          authToken: authToken,
        });
        // console.log(username,authToken)
        await auth.save();
        await user.save();
       
      }
      auth = await userModel.userauth.find({ userName: username });
      res.status(200).send({ token: auth[0]["authToken"] });
    } else {
      auth = await userModel.userauth.find({ userName: username });
      res.status(200).send({ token: auth[0]["authToken"] });
      //console.log({token:auth[0]["authToken"]})
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

exports.getTicketController = async (req, res) => {
  // const tickets = await userModel.tickets.find();
  console.log(req.body.token)
};

exports.markTicketController = async (req, res) => {};

exports.connectTicketController = async (req, res) => {};

exports.getUserController = (req, res) => {
  user=getUsername(res.body.token)
  res.send({username:user}) 
};
