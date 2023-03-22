const bcrypt = require("bcrypt")
const user = require("../model/userModel")
const mailer = require("../middleware/otpValidation")
const randomString=require("randomstring")
const product=require("../model/productModel")
const category = require("../model/categoryModel")
const nodemailer=require("nodemailer")


let name
let email
let phone
let password
const sendresetPasswordMail=async(name,email,token)=>{
    try {
      const transporter=  nodemailer.createTransport({
            service:"gmail",
        auth:{
            user:"eshoes518@gmail.com",
            pass:process.env.PASS
        }
        })
        let mailOption = {
            from: "eshoes518@gmail.com",
            to: email,
            subject: "Link for reset password",
            html: '<p>Hi ..'+name+' plzee copy the link <a href="http://localhost:4000/resetpassword?token='+token+'">Reset</a> your password.</p>'
        }
        transporter.sendMail(mailOption,function(error,infor){
            if(error){
                console.log(error);
            }else{
                console.log("mail has been send to the email");

            }
        })


        
    } catch (error) {
        console.log(error);
        
    }

}

const home = async (req, res) => {
    let session = req.session.user;
    let acname = await user.findOne({ email: session })
    let productData=await product.find()
    let categoryData=await category.find()
    
    try {
        if (session) {
            customer = true;
            res.render("user/home", { customer, acname ,productData,categoryData})
        }
        else {
            customer = false
            res.render("user/home", { customer, acname ,productData,categoryData})
        }

    } catch (error) {
        res.render("user/500")

    }


}


const login = (req, res) => {
    if (req.session.user) {
        res.redirect("/")
    } else {
        res.render("user/login")

    }

}
const signup = (req, res) => {
    res.render("user/signup")
}

const postsignup = async (req, res) => {

    name = req.body.name
    email = req.body.email
    phone = req.body.phone
    password = await bcrypt.hash(req.body.password, 10)

    console.log(mailer.OTP);

    let mailDetails = {
        from: "eshoes518@gmail.com",
        to: email,
        subject: "Otp for E-shoes varification",
        html: `<p>Hi ${name} ..Your OTP FOR registration on E-SHOES:  ${mailer.OTP}<P>`,
    };

    let users = await user.findOne({ email: email })
    try {
        if (users) {
            res.render("user/signup", { error: "User already exsisted" })
        } else {
            mailer.mailerTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("user/otp", { name, email, phone, password })
                    console.log("otp has sented");
                }
            });
        }

    } catch (error) {
        res.render("user/500")

    }


}
const postotp = async (req, res) => {
    let otp = req.body.otp
    try {
        if (mailer.OTP == otp) {
            await user.create({
                name: name,
                email: email,
                phone: phone,
                password: password,
            })
            // await user.updateMany({ email: email }, { $set: { isVerified: true } })
            res.render("user/login")

        } else {
            res.render("user/otp", { error: "Invalid OTP" })
        }

    } catch (error) {
        res.render("user/500")

    }

}
const postlogin = async (req, res) => {

    let email = req.body.email
    let password = req.body.password
    try {
        let userData = await user.findOne({ email: email })
        if (userData) {
            let passwordMatch = await bcrypt.compare(password, userData.password)
            if(userData.blocked===false){
                if (passwordMatch) {
                    req.session.user = email
    
                    res.redirect("/")
                } else {
                    res.render("user/login", { error: "Invalid username or password" })
                }

            }else{
                res.render("user/login", { error: "Your are blocked " })

            }
           
        } else {
            res.render("user/login", { error: "Email doesn't exist" })
        }

    } catch (error) {

        res.render("user/500")
    }

}
const logout = (req, res) => {
    req.session.user = false;
    res.redirect("/")
}
const forgetpassword=(req,res)=>{
    res.render("user/forgetpassword")
}
const postforgetpassword=async(req,res)=>{
    try {
        const email=req.body.email
        const userData= await user.findOne({email:email})
        
        if(userData){
            if(userData.blocked === false){
                 const randomstring =randomString.generate()
                const data=await user.updateOne({email:email},{$set:{token:randomstring}})
                sendresetPasswordMail(userData.name,userData.email,randomstring)
                res.render("user/forgetpassword",{Msg:"please check you email and reset password"})
            }else{
                res.render("user/forgetpassword",{Msg:"This email is blocked"})
            }
            



        }else{
            res.render("user/forgetpassword",{Msg:"Email is not found"})
        }
        
    } catch (error) {
        res.render("user/500")
        
    }
    
}
const  getshop=async(req,res)=>{
    try {
        session=req.session.user
        let categoryData=await category.find()
        let acname = await user.findOne({ email: session })
        let productData=await product.find()
        res.render("user/shop",{product:productData,acname,categoryData})
    } catch (error) {
        res.render("user/500")
        console.log(error);
        
    }
}
const viewproduct=async(req,res)=>{
    try {
        let id=req.params.id
        session=req.session.user
        let categoryData=await category.find()
        let acname = await user.findOne({ email: session })
        let productData=await product.findOne({_id:id})
        res.render("user/viewproduct",{categoryData,acname,product:productData})
        
    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}
const getcart=async(req,res)=>{
    try {
        let session=req.session.user
        let categoryData=await category.find()
        let acname = await user.findOne({ email: session })
        res.render("user/cart",{acname,categoryData})
        
    } catch (error) {
        res.render("user/500")
        console.log(error);
        
    }
}
const getresetpassword=(req,res)=>{
    try {
        let token=req.query.token
        
        res.render("user/resetpassword",{token})
    } catch (error) {
        res.render("user/500")
    }

}
const resetpassword=async(req,res)=>{
    try {
        let token=req.body.token
        const userData=await user.findOne({token:token})
       
        if(userData){
            let password= await bcrypt.hash(req.body.password,10)
            await user.updateOne({_id:userData.id},{$set:{password:password,token:""}})
            res.redirect("/login")

        }else{
            res.render("user/resetpassword",{Msg:"link has been expired"})
        }
        
    } catch (error) {
        res.render("admin/500")
        console.log(error);
        
    }

}



module.exports = {
    home,
    login,
    signup,
    postsignup,
    postotp,
    postlogin,
    logout,
    forgetpassword,
    postforgetpassword,
    getshop,
    viewproduct,
    getcart,
    getresetpassword,
    resetpassword

}