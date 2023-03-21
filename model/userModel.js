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
    address:[{
        name:{
            type:String
        },
        housename:{
            type:String
        },
        post:{
            type:String
        },
        city:{
            type:String
        },
        district:{
            type:String
        },
        pin:{
            type:String
        },
        phone:{
            type:String
        }

    }],
    password:{
        type:String,
        require:true,
        trim:true
    },
    blocked:{
        type:Boolean,
        default:false

    },
    isVerified:{
        type:Boolean,
        default:false

    },
    token:{
        type:String,
        default:''
    }
})

const user=mongoose.model("user",userSchema)
module.exports=user;