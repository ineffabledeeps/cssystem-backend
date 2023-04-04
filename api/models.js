const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  userRole: {
    required:true,
    type:String,
  },
    timeStamp:{
        type:Number,
        default:Date.now()
    }
});

const MessageSchema = new mongoose.Schema({
    messageId:{
        type:String
    },
    linkedTo:{
        type:String
    },
    sender:{
        type:String
    },
    receiver:{
        type:String
    },
    status:{
        type:String
    },
    message:{
        type:String
    },
    timestamp:{
        type:Number,
        default:Date.now()
    }
})

const TicketSchema = new mongoose.Schema({
    ticketNumber:{
        type:String
    },
    ticketStatus:{
        type:String
    },
    ticketQuery:{
        type:String
    },
    generator:{
        type:String
    },
    resolver:{
        type:String
    },
    timeStamp:{
        type:Number,
        default:Date.now()
    }
})

const AuthSchema = new mongoose.Schema({
    userName:{
        type:String
    },
    authToken:{
        type:String
    },
    timeStamp:{
        type:Number,
        default:Date.now()
    }
})

const User = mongoose.model("Users", UserSchema);
const Ticket = mongoose.model("Tickets", TicketSchema);
const Messages = mongoose.model("Messages", MessageSchema);
const Auth = mongoose.model("Tokenauth", AuthSchema);

module.exports = {
    users: User,
    userauth: Auth,
    tickets:Ticket,
    messages: Messages,   
 };
