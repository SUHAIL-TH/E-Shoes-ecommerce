const admin=require("../model/adminModel")
const user=require("../model/userModel")
const product=require("../model/productModel")
const category=require("../model/categoryModel")


const viewproduct=async(req,res)=>{ 
    try { 
        let products=await product.find()
        res.render("admin/viewproduct",{products})
             
    } catch (error) {
        res.render("admin/500") 
        console.log(error);     
    }
}
const addproduct=async(req,res)=>{
    try {
        let categoryData=await category.find()
        
        res.render("admin/addproduct",{categoryData})
        
    } catch (error) {
        console.log(error);
        res.render("admin/500")        
    }
}
const postaddproduct=async(req,res)=>{
    try {
        const image=[]
        for(i=0;i<req.files.length;i++){
            image[i]=req.files[i].filename;
        }
        const products= new product({
            productName:req.body.name,
            price:req.body.price,
            image:image,
            discription:req.body.discription,
            category:req.body.category,
            stock:req.body.stock

        } )
     
        await products.save()
        res.redirect("/admin/addproduct")
        
    } catch (error) {
        res.render("admin/500")
        console.log(error);
    }
}
const editproduct=async(req,res)=>{
    try {
        let id=req.params.id
        let categoryData=await category.find()
        let productData= await product.findOne({_id:id})
      
        res.render("admin/editproduct",{productData,categoryData})

        
    } catch (error) {
        res.render("admin/500")
    }
}
const posteditproduct=async(req,res)=>{
    try {
        let id=req.params.id
        if(req.files.length!=0){
        //     const image=[]
        // for(i=0;i<req.files.length;i++){
        //     image[i]=req.files[i].filename
        // }
        await product.findByIdAndUpdate({_id:id},{$set:
            {productName:req.body.name,
                price:req.body.price,
                category:req.body.category,
                discription:req.body.discription,
                stock:req.body.stock,
                status:req.body.status,
                
            }}) 
            for(i=0;i<req.files.length;i++){
                await product.findByIdAndUpdate({_id:id},{$push:{image:req.files[i].filename}})

            }
            
        }else{
            await product.findByIdAndUpdate({_id:id},{$set:
                {productName:req.body.name,
                    price:req.body.price,
                    category:req.body.category,
                    discription:req.body.discription,
                    stock:req.body.stock,
                    status:req.body.status,
                    
                }})

        }
        
        res.redirect("/admin/product")
        
        
    } catch (error) {
        res.render(admin/500)
    }
}
const deleteproduct=async(req,res)=>{
    try {
        let id=req.params.id
        await product.deleteOne({_id:id})
        res.redirect("/admin/product")
        
    } catch (error) {
        res.render("admin/500")
    }
}

//////////////////////////////////////////user
const  viewproductuser = async (req, res) => {
    try {
        let id = req.params.id
        session = req.session.user
        let categoryData = await category.find()
        let acname = await user.findOne({ email: session })
        let productData = await product.findOne({ _id: id })

        res.render("user/viewproduct", { categoryData, acname, product: productData })

    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}




module.exports={
    ////////////////////////////////admin
    viewproduct,
    addproduct,
    postaddproduct,
    editproduct,
    posteditproduct,
    deleteproduct,
    /////////////////////////////////user
    viewproductuser
}