const user = require("../model/usermodels")
const randomString = require("randomstring")
const product = require("../model/productmodel")
const category = require("../model/categorymodel")
const cart = require("../model/cartmodel")
const order=require("../model/ordermodel")

const banner=require("../model/bannermodel")


const addbanner=async(req,res)=>{
    try {
        res.render("admin/addbanner")
        
    } catch (error) {
        res.render("admin/500")
        console.log(error);
    }
}
const postaddbanner=async(req,res)=>{
    try {
       
        const banners=new banner({
            heading:req.body.heading,
            discription:req.body.discription,
            image:req.file.filename
        })
        await banners.save()
        res.redirect("/admin/viewbanner")      
    } catch (error) {
        res.render("admin/500")
    }
}
const viewbanner=async(req,res)=>{
    try {
        let bannerData=await banner.find()      
            res.render("admin/viewbanner",{bannerData})        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const bannerstatus=async(req,res)=>{
    try {
        let id=req.body.id
       
        let text=req.body.text
        
    
        if(text=="false"){
            await banner.findOneAndUpdate({_id:id},{$set:{status:false}})

        }else if(text=="true"){
            await banner.findOneAndUpdate({_id:id},{$set:{status:true}})

        }

        res.json({status:true})

        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const editbanner=async(req,res)=>{
    try {
        let id=req.params.id
        console.log(id);
        let bannerData=await banner.findOne({_id:id})
        res.render("admin/editbanner",{bannerData})
        
    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const posteditbanner=async(req,res)=>{
    try {
        let id =req.params.id
      
        if(typeof(req.files==="undefined")){
            await banner.findOneAndUpdate({_id:id},{$set:{
                heading:req.body.heading,
                discription:req.body.discription,
              
            }})


        }else{
            await banner.findOneAndUpdate({_id:id},{$set:{
                heading:req.body.heading,
                discription:req.body.discription,
                image:req.file.filename
            }})

        }
        res.redirect("/admin/viewbanner")


        
    } catch (error) {
        res.render("admin/500")
        console.log(error);
  }
}


module.exports={
    addbanner,
    postaddbanner,
    viewbanner,
    bannerstatus,
    editbanner,
    posteditbanner,

}