const mongoose=require("mongoose")
const ObjectId=mongoose.Types.ObjectId
const cartSchema=new mongoose.Schema({
    user:{
        type:ObjectId ,
        ref:"user",
        required:true
    },
    product:[
        {
            productId:{
                type:ObjectId,
                ref:"product",
                required:true   
            }, 
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                default:0
            },
            totalPrice:{
                type:Number,
                default:0
            }
        }
    ]
})
const cart=mongoose.model("cart",cartSchema)
module.exports=cart
