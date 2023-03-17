const bcrypt=require("bcrypt")
const mongoose=require("mongoose")
const user=require("../model/userModel")

module.exports={
    home:(req,res)=>{
        let session=req.session.user;
        console.log(session);
        if(session){
            customer=true;
            
        res.render("user/home",{customer})

            
        }
        else{
            customer=false
            res.render("user/home",{customer})
        }
       
    },


    login:(req,res)=>{
        res.render("user/login")
    },signup:(req,res)=>{
        res.render("user/signup")
    },
    postsignup:(req,res)=>{

        res.render("user/otp")
    },
    postotp:(req,res)=>{
        res.render("user/login")
    },
    postlogin:(req,res)=>{
        res.redirect("/")
    }

}