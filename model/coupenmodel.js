const mongoose=require("mongoose")

const couponSchema=new mongoose.Schema({
    couponcode:{
        type:String,
        required:true
    },
    couponamounttype:{
        type:String,
        required:true
    },
    couponamount:{
        type:Number,
        required:true,
    },
    mincartamount:{
        type:Number,

    },
    maxredeemamount:{
        type:Number,
        requied:true
    },
    startdate:{
        type:Date
    },
    expiredate:{
        type:Date
    },
    used:{
        type:Array
    },
    status:{
        type:Boolean,
        default:true
    }
     

},{
    timestamps:true
})
const coupon=mongoose.model("coupon",couponSchema)
module.exports=coupon