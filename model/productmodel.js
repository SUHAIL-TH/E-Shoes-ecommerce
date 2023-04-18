const mongoose=require("mongoose")
const productSchema=new mongoose.Schema({
    productName:{
        type:String,
        require:true,   
    },
    price:{
        type:Number,
        require:true, 
    },
    image:{
        type:Array
    },
    discription:{
        type:String,
        require:true,
    },
    category:{
        type:String,
        require:true
    },
    stock:{
        type:Number,
        require:true,
    },
    status:{
        type:String,
         default:true
    }
    
},
{
    timestamps:true,
})

const product=mongoose.model("product",productSchema)
module.exports=product
