
const mongoose=require("mongoose")
const objectId=mongoose.Types.ObjectId   
const orderSchema=new mongoose.Schema({
    deliveryDetails:{
        type:String,
        required:true 
    },
    user:{
        type:objectId,
        ref:"user",
        required:true
    },
    product:[{
        productId:{
            type:objectId,
            ref:"product",
            required:true
        },
        quantity:{
            type:Number,
            required:true
        }
    }],
    totalamount:{
        type:Number,
    },
    date:{
        type:Date
    },
    status:{
        type:String
    },
    paymentMethode:{
        type:String
    },
     paymentId: {
        type:String,
      },
      wallet:{
        type:Number
      }
      


},{
    timestamps:true
}
)
const order= mongoose.model("order",orderSchema)
module.exports=order
