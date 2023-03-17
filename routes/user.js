const express=require("express");
userRouter=express()
const userController=require("../controllers/usercontroller")




userRouter.get("/",userController.home);
userRouter.get("/login",userController.login)
userRouter.get("/signup",userController.signup)
userRouter.post("/signup",userController.postsignup)
userRouter.post("/otp",userController.postotp)
userRouter.post("/login",userController.postlogin)

module.exports=userRouter