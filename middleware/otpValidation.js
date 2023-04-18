const nodemailer=require("nodemailer")
const dotenv=require("dotenv")
dotenv.config()

module.exports={
    mailerTransporter:nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"eshoes518@gmail.com",
            pass:process.env.PASS
        }
    }),
    OTP:`${Math.floor(1000+Math.random()*9000)}`

    
    //hjdkfhkdsg
}