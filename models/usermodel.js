const mongoose=require("mongoose");
const user=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        default:''
    }

});
module.exports=mongoose.model("User",user);
