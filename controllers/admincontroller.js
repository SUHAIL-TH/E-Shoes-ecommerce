
const admin=require("../model/adminmodel")
const user=require("../model/userModel")
const product=require("../model/productmodel")
const category=require("../model/categorymodel")
const order =require("../model/ordermodel")
const uc=require("upper-case")
const coupon=require("../model/coupenmodel")
const excel=require("exceljs")
const banner=require("../model/bannermodel")
const moment=require("moment")
moment().format()
//html to pdf generate required things
const ejs=require("ejs")
const pdf=require("html-pdf")
const fs=require("fs")
const path=require("path")
const { response } = require("express")






  
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
 const home=async(req,res)=>{
    try {
        let productscount= await product.find().count()
        const activeProduct=await product.find({status:true}).count()
            const activeUsers=await user.find({blocked:false}).count()
            const blockedUsers=await user.find({blocked:true}).count()
            const deliveredCount=await order.find({status:"Delivered"}).count()
            const totalOrder=await order.find().count()
            const razopayCount=await order.find({paymentMethode:"ONLINE"}).count()
            const codCount=await order.find({paymentMethode:"COD"}).count()
            const orderCanceled=await order.find({status:"Canceled"}).count()
            const categoryCount=await category.find().count()
            const activeCategory=await category.find({status:true}).count()
            const couponCount=await coupon.find().count()
            
           
            res.render("admin/index",{productscount,activeProduct
                ,totalOrder,
                activeUsers,
                blockedUsers,
                deliveredCount,
                razopayCount,codCount,
                orderCanceled,categoryCount,activeCategory,couponCount

            })
        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
        
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
       let orderData=await order.findOne({_id:id})

        let status=req.body.status
        if(status=="return aproved"){
            await user.findOneAndUpdate({_id:orderData.user},{$inc:{wallet:orderData.totalamount}})
        }
        
        await order.findByIdAndUpdate({_id:id},{$set:{status:status}})
        res.redirect("/admin/orders")

    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
// const viewcoupon=async(req,res)=>{
//     try {
//         let couponData=await coupon.find()
//         res.render("admin/viewcoupon",{couponData})
        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error);
//     }
// }
// const addcoupon=async(req,res)=>{
//     try {
        
//         res.render("admin/addcoupon")
        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error)
//     }
// }
// const postaddcoupon=async(req,res)=>{

//     try {
       
//         let couponData=req.body
//         console.log(req.body);
//         let coupons=new coupon({
//             couponcode:req.body.name,
//             couponamounttype:req.body.coupontype,
//             couponamount:req.body.amount,
//             mincartamount:req.body.mincart,
//             maxredeemamount:req.body.maxredeem,
//             expiredate:req.body.date,
//             limit:req.body.limit,
          
            
//         })
//         await coupons.save()
//         res.redirect("/admin/viewcoupon")
        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error)
        
//     }
// }
// const removeimage=async(req,res)=>{
//     try {
//         let id=req.body.id
       
//         let position=req.body.position
//         let productImg=await product.findById(id)
//         let image=productImg.image[position]
//         await product.updateOne({_id:id},{$pullAll:{image:[image]}})
//         res.json({remove:true})
        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error)
//     }
// }
// const removecoupon=async(req,res)=>{
//     try {
//         let id=req.body.id
//         await coupon.findByIdAndRemove({_id:id})
//         res.json("removed:true")
        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error);
//     }
// }
// const addbanner=async(req,res)=>{
//     try {
//         res.render("admin/addbanner")
        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error);
//     }
// }
// const postaddbanner=async(req,res)=>{
//     try {
       
//         const banners=new banner({
//             heading:req.body.heading,
//             discription:req.body.discription,
//             image:req.file.filename
//         })
//         await banners.save()
//         res.redirect("/admin/viewbanner")      
//     } catch (error) {
//         res.render("admin/500")
//     }
// }
// const viewbanner=async(req,res)=>{
//     try {
//         let bannerData=await banner.find()      
//             res.render("admin/viewbanner",{bannerData})        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error)
//     }
// }
// const bannerstatus=async(req,res)=>{
//     try {
//         let id=req.body.id
       
//         let text=req.body.text
        
    
//         if(text=="false"){
//             await banner.findOneAndUpdate({_id:id},{$set:{status:false}})

//         }else if(text=="true"){
//             await banner.findOneAndUpdate({_id:id},{$set:{status:true}})

//         }

//         res.json({status:true})

        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error)
//     }
// }
// const editbanner=async(req,res)=>{
//     try {
//         let id=req.params.id
//         console.log(id);
//         let bannerData=await banner.findOne({_id:id})
//         res.render("admin/editbanner",{bannerData})
        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error)
//     }
// }
// const posteditbanner=async(req,res)=>{
//     try {
//         let id =req.params.id
      
//         if(typeof(req.files==="undefined")){
//             await banner.findOneAndUpdate({_id:id},{$set:{
//                 heading:req.body.heading,
//                 discription:req.body.discription,
              
//             }})


//         }else{
//             await banner.findOneAndUpdate({_id:id},{$set:{
//                 heading:req.body.heading,
//                 discription:req.body.discription,
//                 image:req.file.filename
//             }})

//         }
//         res.redirect("/admin/viewbanner")


        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error);
//   }
// }

// const editcoupon=async(req,res)=>{
//     try {
//         id=req.params.id
//         let couponData=await coupon.findOne({_id:id})
//         res.render("admin/editcoupon",{couponData})
        
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error);
//     }
// }
// const posteditcoupon=async(req,res)=>{
//     try {
//         let id=req.params.id
//         await coupon.findOneAndUpdate({_id:id},{$set:{
//             couponcode:req.body.name,
//             couponamounttype:req.body.coupontype,
//             couponamount:req.body.amount,
//             mincartamount:req.body.mincart,
//             maxredeemamount:req.body.maxredeem,
//             expiredate:req.body.date,
//             limit:req.body.limit,
//         }})

//         res.redirect("/admin/viewcoupon")
//     } catch (error) {
//         res.render("admin/500")
//         console.log(error);
//     }
// }


const excelorder=async(req,res)=>{
    try {
         const workbook=new excel.Workbook();
       const worksheet=  workbook.addWorksheet("orders")
       worksheet.columns=[
        {header:"No:" ,key:"no"},
        {header:"User Id" ,key:"user",width:30},
        {header:"Delivery Address" ,key:"deliveryDetails",width:30},
        {header:"Products" ,key:"product",width:30},
        {header:"Amount" ,key:"totalamount",},
        {header:"Date" ,key:"date",width:20},
        {header:"Status" ,key:"status"},
        {header:"Payment type" ,key:"paymentMethode"},
       ]
       let counter=1;
       const  orderData=await order.find({})
       orderData.forEach((orders)=>{
            orders.no=counter;
            worksheet.addRow(orders)

            counter++
       })
       worksheet.getRow(1).eachCell((cell)=>{
            cell.font={bold:true};
       })
       res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
       )
       res.setHeader("Content-Disposition",`attachment; filename=orders.xlsx`);
       return workbook.xlsx.write(res).then(()=>{
            res.status(200);

       })
        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}

const salesreport=async(req,res)=>{
    try {
        const orderData=await order.find().sort({date:-1 })
        res.render("admin/salesreport",{orderData})
        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const pdforder=async(req,res)=>{
    try {
        let orders=await order.find().sort({data:-1})
        const data={
            orders:orders
        }
       const filePathName =path.resolve(__dirname,'../views/admin/htmltopdf.ejs')
       const htmlString= fs.readFileSync(filePathName).toString()
       let options={
        format:'Letter',

       }
      const ejsData= ejs.render(htmlString,data)
       pdf.create(ejsData,options).toFile('orders.pdf',(err,response)=>{
        if(err)    console.log(err)
        const filePath = path.resolve(__dirname,'../orders.pdf')
        fs.readFile(filePath,(err,file)=>{
            if(err){
                console.log(err)
                return res.status(500).send('could not download file');
            }
            res.setHeader('Content-Type','application/pdf')
            res.setHeader('Content-Disposition','attachment;filename="orders.pdf')
            res.send(file);
        })
       
       })
        
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
    excelorder,
    salesreport,
    pdforder
    // viewcoupon,
    // addcoupon,
    // postaddcoupon,
    // removeimage,
    // removecoupon,
    // addbanner,
    // postaddbanner,
    // viewbanner,
    // bannerstatus,
    // editbanner,
    // posteditbanner,
    // editcoupon,
    // posteditcoupon
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
