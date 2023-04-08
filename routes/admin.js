const express=require("express")
const adminRouter=express()
const adminController=require('../controllers/admincontroller')
const productController=require("../controllers/productController")
const categoryController=require("../controllers/categoryController")
const verifyAdmin=require("../middleware/session")
const multer=require("multer")
const path=require("path")
const { verify } = require("crypto")

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/product-image'))
    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname
        cb(null,name)
    }
})
const upload=multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        if(
            file.mimetype=='image/png'||
            file.mimetype=="image/jpg"||
            file.mimetype=="image/jpeg"||
            file.mimetype=="image/webp"
        ){
            cb(null,true);

        }else{
            cb(null,false);
            return cb(new Error("only .png,.jpg,.jpeg,.webp formalt is allowed"));
        }
    },

});


adminRouter.get("/",adminController.login)
adminRouter.post("/login",adminController.postlogin)
adminRouter.get("/home",adminController.home)
adminRouter.get("/logout",adminController.logout)
adminRouter.get("/viewusers",verifyAdmin.verifyLoginAdmin,adminController.viewusers)
adminRouter.get("/blockuser/:id",adminController.blockuser)
adminRouter.get("/unblockuser/:id",adminController.unblockuser)

adminRouter.get("/product",verifyAdmin.verifyLoginAdmin,productController.viewproduct) 
adminRouter.get("/addproduct",verifyAdmin.verifyLoginAdmin,productController.addproduct)
adminRouter.post("/addproduct",verifyAdmin.verifyLoginAdmin,upload.array("image",5),productController.postaddproduct)
adminRouter.get("/editproduct/:id",verifyAdmin.verifyLoginAdmin,productController.editproduct)
adminRouter.post("/editproduct/:id",verifyAdmin.verifyLoginAdmin,upload.array("image",5),productController.posteditproduct)
adminRouter.get("/deleteproduct/:id",verifyAdmin.verifyLoginAdmin,productController.deleteproduct)

adminRouter.get("/addcategory",verifyAdmin.verifyLoginAdmin,categoryController.addcategory)
adminRouter.get("/viewcategory",verifyAdmin.verifyLoginAdmin,categoryController.viewcategory )
adminRouter.post("/addcategory",verifyAdmin.verifyLoginAdmin,categoryController.postaddcategory)
adminRouter.get("/deletecategory/:id",verifyAdmin.verifyLoginAdmin,categoryController.deletecategory)
adminRouter.get("/truecategory/:id",verifyAdmin.verifyLoginAdmin,categoryController.truecategory)
adminRouter.get("/falsecategory/:id",verifyAdmin.verifyLoginAdmin,categoryController.falsecategory)

adminRouter.get("/orders",verifyAdmin.verifyLoginAdmin,adminController.orders)
adminRouter.get("/orderdetails/:id",verifyAdmin.verifyLoginAdmin,adminController.orderdetails)
adminRouter.post("/updatestatus",verifyAdmin.verifyLoginAdmin,adminController.updatestatus)

adminRouter.get("/viewcoupon",verifyAdmin.verifyLoginAdmin,adminController.viewcoupon)
adminRouter.get("/addcoupon",verifyAdmin.verifyLoginAdmin,adminController.addcoupon)
adminRouter.post("/addcoupon",verifyAdmin.verifyLoginAdmin,adminController.postaddcoupon)
adminRouter.post("/removecoupon",verifyAdmin.verifyLoginAdmin,adminController.removecoupon)

adminRouter.post("/removeimage",verifyAdmin.verifyLoginAdmin,adminController.removeimage)

adminRouter.get("/addbanner",verifyAdmin.verifyLoginAdmin,adminController.addbanner)
adminRouter.post("/addbanner",verifyAdmin.verifyLoginAdmin,upload.single("bannerimage"),adminController.postaddbanner)
adminRouter.get("/viewbanner",verifyAdmin.verifyLoginAdmin,adminController.viewbanner)
adminRouter.post("/updatebanner",verifyAdmin.verifyLoginAdmin,adminController.bannerstatus)
adminRouter.get("/editbanner/:id",verifyAdmin.verifyLoginAdmin,adminController.editbanner)
adminRouter.post("/editbanner/:id",verifyAdmin.verifyLoginAdmin,upload.single("bannerimage"),adminController.posteditbanner)




module.exports=adminRouter;