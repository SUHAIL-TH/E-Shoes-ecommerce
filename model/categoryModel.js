const mongoose=require("mongoose")
const categorySchema=new mongoose.Schema({
    category:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:false 
    }

})

const category=mongoose.model("category",categorySchema)
module.exports=category 