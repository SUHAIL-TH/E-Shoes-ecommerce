const express=require("express");
const userRouter=express()
const userController=require("../controllers/usercontroller")
const productController=require("../controllers/productcontroller")
const categoryController=require("../controllers/categorycontroller")
const couponController=require("../controllers/coupencontroller")
const verifyLogin=require("../middleware/session")
const blockeduser=require("../middleware/blockedusers")
const cartController=require("../controllers/cartcontroller")
const wishlistController=require("../controllers/wishlistcontroller")




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
userRouter.get("/contact",verifyLogin.verifyUserLogin,userController.contact)
userRouter.get("/shop",userController.getshop)


//product controller
userRouter.get("/viewproduct/:id",productController.viewproductuser)
userRouter.post("/searchproduct",productController.searchproduct)
userRouter.get("/categoryproduct",blockeduser,productController.categoryproduct)



//cart controller
userRouter.get("/addtocart/:id",verifyLogin.verifyUserLogin,cartController.addtocart)
userRouter.get("/cart",blockeduser,verifyLogin.verifyUserLogin,cartController.getcart)
userRouter.post("/removeproduct",cartController.removeproduct)
userRouter.post("/changeproductquantity",cartController.changeproductquantity,cartController.totalproductprice)


//order controller
userRouter.get("/checkout",verifyLogin.verifyUserLogin,userController.checkout)
userRouter.post("/addaddress",verifyLogin.verifyUserLogin,userController.addaddress)
userRouter.get("/deleteaddress/:id",verifyLogin.verifyUserLogin,userController.deleteaddress)

userRouter.post("/placeorder",verifyLogin.verifyUserLogin,userController.placeorder)
userRouter.get("/ordersuccess",verifyLogin.verifyUserLogin,userController.ordersuccess)
userRouter.get("/vieworders",verifyLogin.verifyUserLogin,userController.vieworders)
userRouter.post("/verifypayment",userController.verifypayment)
userRouter.get("/orderedproduct/:id",verifyLogin.verifyUserLogin,userController.orderedproduct)
userRouter.post("/cancelorder",verifyLogin.verifyUserLogin,userController.cancelorder)
userRouter.post("/returnorder",verifyLogin.verifyUserLogin,userController.returnorder)

//coupon controller
userRouter.post("/applycoupon",couponController.applycoupon)

//wishlist controller
userRouter.post("/addtowishlist",wishlistController.addtowishlist)
userRouter.get("/viewwishlist",verifyLogin.verifyUserLogin,wishlistController.viewwishlist)
userRouter.post("/removewishlist",verifyLogin.verifyUserLogin,wishlistController.removewishlist)
userRouter.post("/wishtocart",verifyLogin.verifyUserLogin ,wishlistController.wishtocart)


module.exports=userRouter