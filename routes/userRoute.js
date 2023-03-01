const express =require("express");
const user_route=express();
const bodyParser=require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
// const multer=require("multer");
// const path=require("path");
const user_controller=require("../controllers/usercontroller");
const auth=require("../middleware/auth");
user_route.post('/register',user_controller.register_user);

user_route.post('/login',user_controller.user_login);

user_route.get('/test',auth,function(req,res){
res.status(200).send({success:true,msg:"Authenticated"})
});

// user_route.get('/edit',auth,user_controller.editp);

user_route.post('/forget_password',user_controller.forget_password);

user_route.get('/reset-password',user_controller.reset_password);

user_route.get("/yash",(req,res)=>{
    // console.log(req);
    // console.log(req.params.id);
    console.log(req.query.name);
    console.log(req.query.enrollment)
    return res.status(244).json({
        message: `Hello Yash Wardhan Sharma`,
        status: true,
        err: {}
    })
})

user_route.post('/edit',user_controller.updateProfile);

module.exports=user_route;
