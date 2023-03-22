const express=require("express");
userRouter=express()
const userController=require("../controllers/usercontroller")
const verifyLogin=require("../middleware/session")
const blockeduser=require("../middleware/blockedUser")




userRouter.get("/",blockeduser,userController.home);
userRouter.get("/login", userController.login)
userRouter.get("/signup",userController.signup)
userRouter.post("/signup",userController.postsignup)
userRouter.post("/otp",userController.postotp)
userRouter.post("/login",userController.postlogin)
userRouter.get("/logout",userController.logout)
userRouter.get("/forgetpassword",userController.forgetpassword)
userRouter.post("/forgetpassword",userController.postforgetpassword)
userRouter.get("/resetpassword",userController.getresetpassword)
userRouter.post("/resetpassword",userController.resetpassword)


userRouter.get("/shop",blockeduser,verifyLogin.verifyUserLogin,userController.getshop)

userRouter.get("/cart",blockeduser,verifyLogin.verifyUserLogin,userController.getcart)

userRouter.get("/viewproduct/:id",userController.viewproduct)

module.exports=userRouter