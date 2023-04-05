
const admin=require("../model/adminModel")
const user=require("../model/userModel")
const product=require("../model/productModel")
const category=require("../model/categoryModel")
const order =require("../model/ordermodel")
const uc=require("upper-case")
const coupon=require("../model/coupenmodel")






  
const login=(req,res)=>{
        if(req.session.admin){
            res.redirect("/admin/home")
        }else{
            res.render("admin/login")
        }
       
    }
const postlogin=async(req,res)=>{
        let email=req.body.email
        let password=req.body.password
        let adminData= await admin.findOne({email:email})
       try {
         if(adminData){
            if(password==adminData.password){
                req.session.admin=email;
                res.redirect("/admin/home")
            }else{
                res.render("admin/login",{error:"Invalid password"})
            }

        }else{
            res.render("admin/login",{error:"Invalid email"})

        }
        
       } catch (error) {
        res.render("admin/500")
        console.log(error);  
       }
    }
 const home=(req,res)=>{
        if(req.session.admin){
            res.render("admin/index")
        }else{
            res.redirect("/admin")
        }
        
    }
const logout=(req,res)=>{
    req.session.admin=false,
    res.redirect("/admin")

}    
const viewusers=async(req,res)=>{
   
    try {
        const allusers=await user.find({})   
        res.render("admin/allusers",{allusers})    
    } catch (error) {
        res.render("admin/500")
        
    }
    

}
const blockuser=async(req,res)=>{
    try {
        let id=req.params.id
        console.log(id);
        await user.updateOne({_id:id},{$set:{blocked:true}})
        res.redirect("/admin/viewusers")     
    } catch (error) {
        res.render("admin/500")
    }

}  
const unblockuser=async(req,res)=>{
    try {
        let id=req.params.id
        await user.updateOne({_id:id},{$set:{blocked:false}})
            res.redirect("/admin/viewusers")     
    } catch (error) {
        res.render("admin/500")
        console.log(error);
    }
}  
// const viewproduct=async(req,res)=>{ 
//     try { 
//         let products=await product.find()
//         res.render("admin/viewproduct",{products})
             
//     } catch (error) {
//         res.render("admin/500") 
//         console.log(error);     
//     }
// }
// const addproduct=async(req,res)=>{
//     try {
//         let categoryData=await category.find()
        
//         res.render("admin/addproduct",{categoryData})
        
//     } catch (error) {
//         console.log(error);
//         res.render("admin/500")        
//     }
// }
// const postaddproduct=async(req,res)=>{
//     try {
//         const image=[]
//         for(i=0;i<req.files.length;i++){
//             image[i]=req.files[i].filename;
//         }
//         const products= new product({
//             productName:req.body.name,
//             price:req.body.price,
//             image:image,
//             discription:req.body.discription,
//             category:req.body.category,
//             stock:req.body.stock

//         } )
     
//         await products.save()
//         res.redirect("/admin/addproduct")
        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error);
//     }
// }
// const editproduct=async(req,res)=>{
//     try {
//         let id=req.params.id
//         let categoryData=await category.find()
//         let productData= await product.findOne({_id:id})
      
//         res.render("admin/editproduct",{productData,categoryData})

        
//     } catch (error) {
//         res.render("admin/500")
//     }
// }
// const posteditproduct=async(req,res)=>{
//     try {
//         let id=req.params.id
//         if(req.files.length!=0){
//             const image=[]
//         for(i=0;i<req.files.length;i++){
//             image[i]=req.files[i].filename
//         }
//         await product.findByIdAndUpdate({_id:id},{$set:
//             {productName:req.body.name,
//                 price:req.body.price,
//                 category:req.body.category,
//                 discription:req.body.discription,
//                 stock:req.body.stock,
//                 status:req.body.status,
//                 image:image
//             }})

//         }else{
//             await product.findByIdAndUpdate({_id:id},{$set:
//                 {productName:req.body.name,
//                     price:req.body.price,
//                     category:req.body.category,
//                     discription:req.body.discription,
//                     stock:req.body.stock,
//                     status:req.body.status,
                    
//                 }})

//         }
        
//         res.redirect("/admin/product")
        
        
//     } catch (error) {
//         res.render(admin/500)
//     }
// }
// const deleteproduct=async(req,res)=>{
//     try {
//         let id=req.params.id
//         await product.deleteOne({_id:id})
//         res.redirect("/admin/product")
        
//     } catch (error) {
//         res.render("admin/500")
//     }
// }
// const viewcategory=async(req,res)=>{
//     try {
//         let categoryData=await category.find()
        
//         res.render("admin/viewcategory",{categoryData})
        
//     } catch (error) {
//         res.render("admin/500")
//     }
// }
// const addcategory=(req,res)=>{
//     try {
//         res.render("admin/addcategory")
        
//     } catch (error) {
//         res.render("admin/500")
        
//     }
// }
// const postaddcategory=async(req,res)=>{
//     try {
//         let categoryname= uc.upperCase(req.body.category) 
//         let categoryData=await category.findOne({categoryName:categoryname})
        
//         const categorys=new category({
//             categoryName:categoryname

//         })
        
//         if(categoryData){
//             res.render("admin/addcategory",{error:"Category already exsisted"})
          
            

//         }else{
//             await categorys.save()
//             res.render("admin/addcategory",{error:"Category added successfully"})
//         }
       
       

        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error);
        
//     }
// }
// const deletecategory=async(req,res)=>{
//     try {
//         let id=req.params.id
//         await category.deleteOne({_id:id})
//         res.redirect("/admin/viewcategory")

        
//     } catch (error) {
//         res.render("admin/500")        
//     }
// }
// const truecategory=async(req,res)=>{
//     try {
//         let id =req.params.id
//         await category.updateOne({_id:id},{$set:{status:true}})
//         res.redirect("/admin/viewcategory")
        
//     } catch (error) {
//         res.render("admin/500")
        
//     }

// }
// const falsecategory=async(req,res)=>{
//     try {
//         let id =req.params.id
//         console.log(id); 
//         await category.updateOne({_id:id},{$set:{status:false}})
//         res.redirect("/admin/viewcategory")
        
//     } catch (error) {
//         res.render("admin/500")
        
//     }

// }
const orders=async(req,res)=>{
    try {
        let orderData=await order.find()

        res.render("admin/orders",{orderData})
        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const orderdetails=async(req,res)=>{
    try {
        let id=req.params.id
        let orderData=await order.findById({_id:id}).populate("product.productId")
        res.render("admin/orderdetails",{orderData})
        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const updatestatus=async(req,res)=>{
    try {
        let id=req.body.id
        let status=req.body.status
        console.log(status,id);
        await order.findByIdAndUpdate({_id:id},{$set:{status:status}})
        res.redirect("/admin/orders")

    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const viewcoupon=async(req,res)=>{
    try {
        let couponData=await coupon.find()
        res.render("admin/viewcoupon",{couponData})
        
    } catch (error) {
        res.render("admin/500")
        console.log(error);
    }
}
const addcoupon=async(req,res)=>{
    try {
        
        res.render("admin/addcoupon")
        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const postaddcoupon=async(req,res)=>{

    try {
       
        let couponData=req.body
        console.log(req.body);
        let coupons=new coupon({
            couponcode:req.body.name,
            couponamounttype:req.body.coupontype,
            couponamount:req.body.amount,
            mincartamount:req.body.mincart,
            maxredeemamount:req.body.maxredeem,
            expiredate:req.body.date,
            limit:req.body.limit,
          
            
        })
        await coupons.save()
        res.redirect("/admin/viewcoupon")
        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
        
    }
}
const removeimage=async(req,res)=>{
    try {
        let id=req.body.id
       
        let position=req.body.position
        let productImg=await product.findById(id)
        let image=productImg.image[position]
        await product.updateOne({_id:id},{$pullAll:{image:[image]}})
        res.json({remove:true})
        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const removecoupon=async(req,res)=>{
    try {
        let id=req.body.id
        await coupon.findByIdAndRemove({_id:id})
        res.json("removed:true")
        
    } catch (error) {
        res.render("admin/500")
        console.log(error);
    }
}


module.exports={
    login,
    postlogin,
    home,
    viewusers,
    blockuser,
    unblockuser,
    logout ,
    orders,
    orderdetails,
    updatestatus,
    viewcoupon,
    addcoupon,
    postaddcoupon,
    removeimage,
    removecoupon
    // viewproduct,
    // addproduct,
    // postaddproduct,
    // editproduct,
    // posteditproduct,
    // deleteproduct,
    // viewcategory,
    // addcategory,
    // postaddcategory,
    // deletecategory, 
    // truecategory,
    // falsecategory,
    

     

}
