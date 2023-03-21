const express=require("express")
const adminRouter=express()
const adminController=require('../controllers/admincontroller')
const verifyAdmin=require("../middleware/session")
const multer=require("multer")
const path=require("path")

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
adminRouter.get("/product",verifyAdmin.verifyLoginAdmin,adminController.viewproduct) 
adminRouter.get("/addproduct",verifyAdmin.verifyLoginAdmin,adminController.addproduct)
adminRouter.post("/addproduct",verifyAdmin.verifyLoginAdmin,upload.array("image",5),adminController.postaddproduct)
adminRouter.get("/editproduct/:id",verifyAdmin.verifyLoginAdmin,adminController.editproduct)
adminRouter.post("/editproduct/:id",verifyAdmin.verifyLoginAdmin,upload.array("image",5),adminController.posteditproduct)


module.exports=adminRouter;