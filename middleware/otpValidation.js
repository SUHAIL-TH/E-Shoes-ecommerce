const nodemailer=require("nodemailer")
const dotenv=require("dotenv")
dotenv.config()

module.exports={
    mailerTransporter:nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"eshoes518@gmail.com",
            pass:"fjjsmlxgavwxvsem"
        }

    }),
    OTP:`${Math.floor(1000+Math.random()*9000)}`
    
}