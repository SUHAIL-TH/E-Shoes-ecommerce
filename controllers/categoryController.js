const admin=require("../model/adminModel")
const user=require("../model/userModel")
const product=require("../model/productModel")
const category=require("../model/categoryModel")
const uc=require("upper-case")


const viewcategory=async(req,res)=>{
    try {
        let categoryData=await category.find()
        
        res.render("admin/viewcategory",{categoryData})
        
    } catch (error) {
        res.render("admin/500")
    }
}
const addcategory=(req,res)=>{
    try {
        res.render("admin/addcategory")
        
    } catch (error) {
        res.render("admin/500")
        
    }
}
const postaddcategory=async(req,res)=>{
    try {
        let categoryname= uc.upperCase(req.body.category) 
        console.log(categoryname);
        let categoryData=await category.findOne({categoryName:categoryname})
        
        const categorys=new category({
            categoryName:categoryname

        })
        
        if(categoryData){
            res.render("admin/addcategory",{error:"Category already exsisted"})
          
            

        }else{
            await categorys.save()
            res.render("admin/addcategory",{error:"Category added successfully"})
        }
       
       

        
    } catch (error) {
        res.render("admin/500")
        console.log(error);
        
    }
}
const deletecategory=async(req,res)=>{
    try {
        let id=req.params.id
        await category.deleteOne({_id:id})
        res.redirect("/admin/viewcategory")

        
    } catch (error) {
        res.render("admin/500")        
    }
}
const truecategory=async(req,res)=>{
    try {
        let id =req.params.id
        await category.updateOne({_id:id},{$set:{status:true}})
        res.redirect("/admin/viewcategory")
        
    } catch (error) {
        res.render("admin/500")
        
    }

}
const falsecategory=async(req,res)=>{
    try {
        let id =req.params.id
        console.log(id); 
        await category.updateOne({_id:id},{$set:{status:false}})
        res.redirect("/admin/viewcategory")
        
    } catch (error) {
        res.render("admin/500")
        
    }

}






const categoryproduct = async (req, res) => {
    try {
        let id = req.query.id
        let session = req.session.user
    
       
      
        let categoryData = await category.find()
        let [categoryDatas] = await category.find({ _id: id })
        let acname = await user.findOne({ email: session })
        let products = await product.find({ category: categoryDatas.categoryName })
        res.render("user/categoryproduct", { acname, categoryData, products })

    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}


module.exports={

    //////////////////admin
    viewcategory,
    addcategory,
    postaddcategory,
    deletecategory, 
    truecategory,
    falsecategory,




    //////////////////////user
    categoryproduct,
    



}