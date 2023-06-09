//jshint esversion:6
require("dotenv").config();// always on the top
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


const app= express();
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB")
const userSchema = new mongoose.Schema({
    email:String,
    password: String

});
// encryption key
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] })





const User = new mongoose.model("User",userSchema);




app.get("/",(function(req,res){
    res.render("home")
}))
app.get("/register",(function(req,res){
    res.render("register")
}))
app.get("/login",(function(req,res){
    res.render("login")
}))

app.post("/register", function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
  
    newUser.save()
      .then(() => {
        res.render("secrets");
      })
      .catch((err) => {
        console.log(err);
      });
  });
  
  app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
  
    User.findOne({ email: username })
      .then(foundUser => {
        if (foundUser && foundUser.password === password) {
          res.render("secrets");
        } else {
          res.redirect("/login");
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
  

app.listen(3000,(function(){
    console.log("server started on port 3000");
}))
