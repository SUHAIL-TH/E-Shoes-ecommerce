const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        require:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true,

    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    blocked:{
        type:Boolean,
        default:false

    }
})

const user=mongoose.model("user",userSchema)
module.exports=user;