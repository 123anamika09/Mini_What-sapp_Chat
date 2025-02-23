const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Chat = require("./models/chat.js")

//mongoose connection built
main()
.then(()=>{
    console.log("connection succesful");
}).catch((err)=>{
    console.log(err);
});


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs"); // start to create ejs file
app.use(express.static(path.join(__dirname, "public"))); //add styling to chats 
app.use(express.urlencoded({extended:true}));// create route fetch data from body by this
app.use(methodOverride("_method")); //method overide use

//app.use is used for middleware here view engine is not middleware

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp") // whatsapp db
}

let chat1 = new Chat({
    from:"Anamika",
    to:"Ankit",
    msg:"hey what's up !! what are you doing",
    created_at: new Date(), //by default fnc inn js to create date  constructor
});
chat1.save().then((res)=>{
    console.log(res);
});

                                  // -------------------------2. new route--------------
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})

           // ------------------------3. create route = from render when click on buttom it go to post method & fetch data from db-------------
app.post("/chats",(req,res)=>{
    let {from , to , msg} = req.body; //created in db newChat
    let newChat = new Chat ({
        from:from,
        to:to,
            msg:msg,
            created_at:new Date(),
    });
    // console.log(newChat);    

    // instead of printing the chat save the chat
    newChat
    .save() // async
    .then((res)=>{ //where we use then we don't use await
     console.log("Chat was saved");
    }).catch((err)=>{
        console.log(err);
    });
    res.redirect("/chats");
});
                                    // --------------------1.chats index route----------------
app.get("/chats",async(req,res)=>{
    //take all chats data from db ... we use command 
   let chats =  await Chat.find(); //chat - asynchronus fnc b'coz take data frm database
   console.log(chats);
//    res.send("working");
   res.render("index.ejs",{chats});
});


// ----------------------------------------4. Edit route----------------------------------
app.get("/chats/:id/edit",async(req,res)=>{
    let {id} = req.params;
   let chat = await Chat.findById(id); // js me koii v chizz search krna sync hota to make it async call back
    res.render("edit.ejs" ,{chat});

})

// -----------------------------------------5. update route----------------------------------
app.put("/chats/:id",async (req,res)=>{
    let {id} = req.params;
    let {msg:newMsg} = req.body;
    let updatedChats = await Chat.findByIdAndUpdate(id,{msg:newMsg},{runValidators:true},{new:true});
    // console.log(updatedChats);
    res.redirect("/chats")
});


// ----------------------------------------------6.destroy/delet Route------------------------------
app.delete("/chats/:id", async(req,res)=>{
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
});

app.get("/",(req,res)=>{
    res.send("root is working");
});

// ------------------------------we create a chat which has (__dirname, from , to , MessageChannel, created_at)
//mongoose ka jo model hota h whi db ka collection hota h so make a folder models for db

app.listen(8080,()=>{
    console.log(`server is listening to port ${port}`)
});