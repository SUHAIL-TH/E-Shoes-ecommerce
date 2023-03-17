const express=require("express")
const adminRouter=express()
const adminController=require('../controllers/admincontroller')

adminRouter.get("/",adminController.home)

module.exports=adminRouter;