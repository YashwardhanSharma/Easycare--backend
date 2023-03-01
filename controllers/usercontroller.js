const User = require("../models/usermodel");
const bcryptjs = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const sendResetPasswordMail = async (name, email, token) => {
    try {
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "a8286d264c85d0",
                pass: "ca261e67d92255"
            }
        });
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: "For Reset Password",
            html: '<p>Hii ' + name + ',Please copy the link and <a href="http://localhost:3500/api/reset-password?token=' + token + '"> reset your password</a>'
        }
        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Mail has been send:-", info.response);
            }
        });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}
const create_token = async (id) => {
    try {
        const token = await jwt.sign({ _id: id }, config.secret_jwt);
        return token;
    } catch {
        res.status(400).send(error.message);
    }
}
const securePassword = async (password) => {
    try {
        const passwordHash = await bcryptjs.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

//register

const register_user = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            password: spassword,
        });
        const userData = await User.findOne({ email: req.body.email });
        if (userData) {
            return res.status(200).send({ success: false, msg: "This email is already exists" });
        }
        const user_data = await user.save();
        res.status(200).send({ success: true, data: user_data });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//login

const user_login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcryptjs.compare(password, userData.password);
            if (passwordMatch) {
                const tokenData = await create_token(userData._id);
                const userResult = {
                    //  _id:userResult._id,
                    name: userData.name,
                    email: userData.email,
                    contact: userData.contact,
                    password: userData.password,
                    token: tokenData
                }
                const response = {
                    success: true,
                    msg: "User Details",
                    data: userResult
                }
                res.status(200).send(response);
            } else {
                res.status(200).send({ success: false, msg: "Login details are incorrect" });
            }
        } else {
            res.status(200).send({ success: false, msg: "Login details are incorrect" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//edit

const editp = async (req, res) => {
    try {
        const id = req.body.id;
       const userData=await User.findById({_id:id});
       if(userData){
         res.render('edit',{user:userData})
       }
       else{
        res.redirect('/login');
       }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//update

const updateProfile=async(req,res)=>{
try {
  const user_id=req.body.user_id;
  const name= req.body.name;
  const contact= req.body.contact;
  const email= req.body.email;
  const udata=await User.findOne({_id:user_id});

if (udata) {
    const data = await User.findByIdAndUpdate({ _id: user_id }, { $set: { name: name ,contact:contact,email:email}});
    res.status(200).send({success:true,msg:"Updated"});  

 } else {
    res.status(200).send({success:false,msg:"User not found"});  
 }
} catch (error) {
   res.status(400).send(error.message);
}
}

//Forget

const forget_password = async (req, res) => {
    try {
        // return res.status(200).json({message: `Success`});
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const randomString = randomstring.generate();
            const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
            sendResetPasswordMail(userData.name, userData.email, randomString);
            res.status(200).send({ success: true, msg: "Please check your email inbox and reset your password" });
        } else {
            res.status(200).send({ success: false, msg: "This email dose not exist" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message});
    }
}

//reset

const reset_password=async(req,res)=>{
try {
    const token=req.query.token;
    const tokenData=await User.findOne({token:token});
    console.log(tokenData);
    if(tokenData){
        // console.log("hi");
     const password=req.body.password;
     const newPassword=await securePassword(password);
     const userData=await User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword,token:''}},{new:true});
     res.status(200).send({ success: true, msg:"User Password has been reset",data:userData});
    }
    else{
        res.status(200).send({ success: true, msg:"This link has been expired" });
    }
} catch (error) {
    res.status(400).send({ success: false, msg: error.message });
}
}
module.exports = {
    register_user,
    user_login,
    editp,
    forget_password,
    reset_password,
    updateProfile
}