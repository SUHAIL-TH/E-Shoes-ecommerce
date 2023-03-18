const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const user = require("../model/userModel")
const mailer = require("../middleware/otpValidation")

let name
let email
let phone
let password

const home = async (req, res) => {
    let session = req.session.user;
    let acname = await user.findOne({ email: session })
    try {
        if (session) {
            customer = true;
            res.render("user/home", { customer, acname })
        }
        else {
            customer = false
            res.render("user/home", { customer })
        }

    } catch (error) {
        res.render("user/500")

    }


}


const login = (req, res) => {
    if(req.session.user){
        res.redirect("/")
    }else{
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
        html: `<p>YOUR OTP FOR REGISTRATION IN E-SHOES IS:  ${mailer.OTP}<P>`,
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
            if (passwordMatch) {
                req.session.user = email

                res.redirect("/")
            } else {
                res.render("user/login", { error: "Invalid username or password" })
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



module.exports = {
    home,
    login,
    signup,
    postsignup,
    postotp,
    postlogin,
    logout

}