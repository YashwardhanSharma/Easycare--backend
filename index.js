const express = require("express");
const morgan=require("morgan");
const app=express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/backp");
const user_routes=require("./routes/userRoute");
app.use(morgan());
app.use('/api',user_routes);

app.listen(3500,function(){
    console.log("server is started");
});