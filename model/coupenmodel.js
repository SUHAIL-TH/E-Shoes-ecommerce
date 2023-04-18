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
        required:true

    },
    maxredeemamount:{
        type:Number,
        requied:true
    },

    expiredate:{
        type:Date
    },
    used:{
        type:Array,
        default:[]
    },
    status:{
        type:Boolean,
        default:true
    },
    limit:{
        type:Number,
        required:true
    }
     

},{
    timestamps:true
})
const coupon=mongoose.model("coupon",couponSchema)
module.exports=coupon