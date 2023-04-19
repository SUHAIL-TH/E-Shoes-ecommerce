const express=require("express")
const adminRouter=express()
const adminController=require('../controllers/admincontroller')
const productController=require("../controllers/productcontroller")
const categoryController=require("../controllers/categorycontroller")
const bannerController=require("../controllers/bannercontroller")
const couponController=require("../controllers/coupencontroller")
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
adminRouter.get("/home",verifyAdmin.verifyLoginAdmin,adminController.home)
adminRouter.get("/logout",adminController.logout)
adminRouter.get("/viewusers",verifyAdmin.verifyLoginAdmin,adminController.viewusers)
adminRouter.get("/blockuser/:id",adminController.blockuser)
adminRouter.get("/unblockuser/:id",adminController.unblockuser)
adminRouter.get("/excelexport",verifyAdmin.verifyLoginAdmin,adminController.excelorder)
adminRouter.get("/salesreport",verifyAdmin.verifyLoginAdmin,adminController.salesreport)
// adminRouter.get("/pdforder",verifyAdmin.verifyLoginAdmin,adminController.pdforder)
adminRouter.get("/pdforder",adminController.pdforder)
adminRouter.get("/htmltopdf",adminController.htmltopdf)

adminRouter.get("/product",verifyAdmin.verifyLoginAdmin,productController.viewproduct) 
adminRouter.get("/addproduct",verifyAdmin.verifyLoginAdmin,productController.addproduct)
adminRouter.post("/addproduct",verifyAdmin.verifyLoginAdmin,upload.array("image",5),productController.postaddproduct)
adminRouter.get("/editproduct/:id",verifyAdmin.verifyLoginAdmin,productController.editproduct)
adminRouter.post("/editproduct/:id",verifyAdmin.verifyLoginAdmin,upload.array("image",5),productController.posteditproduct)
adminRouter.get("/deleteproduct/:id",verifyAdmin.verifyLoginAdmin,productController.deleteproduct)
adminRouter.post("/removeimage",verifyAdmin.verifyLoginAdmin,productController.removeimage)

adminRouter.get("/addcategory",verifyAdmin.verifyLoginAdmin,categoryController.addcategory)
adminRouter.get("/viewcategory",verifyAdmin.verifyLoginAdmin,categoryController.viewcategory )
adminRouter.post("/addcategory",verifyAdmin.verifyLoginAdmin,upload.single("catimage"),categoryController.postaddcategory)
adminRouter.get("/deletecategory/:id",verifyAdmin.verifyLoginAdmin,categoryController.deletecategory)
adminRouter.get("/truecategory/:id",verifyAdmin.verifyLoginAdmin,categoryController.truecategory)
adminRouter.get("/falsecategory/:id",verifyAdmin.verifyLoginAdmin,categoryController.falsecategory)



adminRouter.get("/orders",verifyAdmin.verifyLoginAdmin,adminController.orders)
adminRouter.get("/orderdetails/:id",verifyAdmin.verifyLoginAdmin,adminController.orderdetails)
adminRouter.post("/updatestatus",verifyAdmin.verifyLoginAdmin,adminController.updatestatus)



adminRouter.get("/viewcoupon",verifyAdmin.verifyLoginAdmin,couponController.viewcoupon)
adminRouter.get("/addcoupon",verifyAdmin.verifyLoginAdmin,couponController.addcoupon)
adminRouter.post("/addcoupon",verifyAdmin.verifyLoginAdmin,couponController.postaddcoupon)
adminRouter.post("/removecoupon",verifyAdmin.verifyLoginAdmin,couponController.removecoupon)
adminRouter.get("/editcoupon/:id",verifyAdmin.verifyLoginAdmin,couponController.editcoupon)
adminRouter.post("/editcoupon/:id",verifyAdmin.verifyLoginAdmin,couponController.posteditcoupon)



adminRouter.get("/addbanner",verifyAdmin.verifyLoginAdmin,bannerController.addbanner)
adminRouter.post("/addbanner",verifyAdmin.verifyLoginAdmin,upload.single("bannerimage"),bannerController.postaddbanner)
adminRouter.get("/viewbanner",verifyAdmin.verifyLoginAdmin,bannerController.viewbanner)
adminRouter.post("/updatebanner",verifyAdmin.verifyLoginAdmin,bannerController.bannerstatus)
adminRouter.get("/editbanner/:id",verifyAdmin.verifyLoginAdmin,bannerController.editbanner)
adminRouter.post("/editbanner/:id",verifyAdmin.verifyLoginAdmin,upload.single("bannerimage"),bannerController.posteditbanner)




module.exports=adminRouter;