const express=require("express");
const userRouter=express()
const userController=require("../controllers/usercontroller")
const productController=require("../controllers/productController")
const categoryController=require("../controllers/categoryController")
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
userRouter.post("/resetpassword",blockeduser,userController.resetpassword)
userRouter.get("/profile",blockeduser,verifyLogin.verifyUserLogin,userController.profile)
userRouter.post("/postprofile",blockeduser,verifyLogin.verifyUserLogin,userController.postprofile)

userRouter.get("/shop",blockeduser,verifyLogin.verifyUserLogin,userController.getshop)

userRouter.get("/viewproduct/:id",productController.viewproductuser)
userRouter.post("/changeproductquantity",userController.changeproductquantity,userController.totalproductprice)

userRouter.get("/categoryproduct",blockeduser,categoryController.categoryproduct)

userRouter.get("/addtocart/:id",verifyLogin.verifyUserLogin,userController.addtocart)
userRouter.get("/cart",blockeduser,verifyLogin.verifyUserLogin,userController.getcart)
userRouter.post("/removeproduct",userController.removeproduct)

userRouter.get("/checkout",verifyLogin.verifyUserLogin,userController.checkout)
userRouter.post("/addaddress",verifyLogin.verifyUserLogin,userController.addaddress)
userRouter.get("/deleteaddress/:id",verifyLogin.verifyUserLogin,userController.deleteaddress)

userRouter.post("/placeorder",verifyLogin.verifyUserLogin,userController.placeorder)
userRouter.get("/ordersuccess",verifyLogin.verifyUserLogin,userController.ordersuccess)
userRouter.get("/vieworders",verifyLogin.verifyUserLogin,userController.vieworders)
userRouter.post("/verifypayment",userController.verifypayment)
userRouter.get("/orderedproduct/:id",verifyLogin.verifyUserLogin,userController.orderedproduct)

userRouter.post("/applycoupon",userController.applycoupon)

userRouter.post("/addtowishlist",userController.addtowishlist)
userRouter.get("/viewwishlist",verifyLogin.verifyUserLogin,userController.viewwishlist)
userRouter.post("/removewishlist",verifyLogin.verifyUserLogin,userController.removewishlist)
userRouter.post("/wishtocart",verifyLogin.verifyUserLogin ,userController.wishtocart)


module.exports=userRouter