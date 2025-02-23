const mongoose = require("mongoose");
//connection built already so now make schema
const chatSchema  = new mongoose.Schema({
    from:{
        type : String,
        required:true,
    },
    to:{
        type:String,
        required:true,
    }, 
    created_at:{
        type:Date,
        required:true,
    },
    msg:{
        type:String,
        maxLength:50,
    },
});

// ---model created-----------------
const Chat = mongoose.model("Chat",chatSchema); 
module.exports= Chat;