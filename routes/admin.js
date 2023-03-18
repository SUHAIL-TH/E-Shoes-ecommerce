const express=require("express")
const adminRouter=express()
const adminController=require('../controllers/admincontroller')

adminRouter.get("/",adminController.login)
adminRouter.post("/login",adminController.postlogin)
adminRouter.get("/home",adminController.home)

module.exports=adminRouter;