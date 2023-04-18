const mongoose=require("mongoose")
const ObjectId=mongoose.Types.ObjectId

const wishlistSchema=new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:"user",
        required:true
    },
    product:[{
        productId:{
            type:ObjectId,
            ref:"product",
            required:true
        },
        name:{
            type:String
        },
        price:{
            type:Number
        }
    }]
})

const wishlist=mongoose.model("wishlist",wishlistSchema)
module.exports=wishlist;