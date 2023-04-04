const url = 'mongodb://127.0.0.1:27017/cssystem';
const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./models")

const app = express();
mongoose.connect(url,
    
  {
    useNewUrlParser: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(express.json())

app.get("/add_user", async (request, response) => {
    const users = await userModel.users.find({});
  
    try {
        response.send(users);
      } catch (error) {
        response.status(500).send(error);
      }
});

app.post("/add_user", async (request, response) => {
    const user = new userModel.users(request.body);
    const users = await userModel.users.find({"userName":request.body.userName});
    //console.log(users.length)
    try {
      if (users.length==0){
      await user.save();
      response.status(200).send();
      }else{
        response.status(409).send();
      }
    } catch (error) {
      response.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log("Server is running at port 3000");
  });

