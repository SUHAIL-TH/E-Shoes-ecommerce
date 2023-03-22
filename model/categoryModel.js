const mongoose=require("mongoose")
const categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:true 
    }

})

const category=mongoose.model("category",categorySchema)
module.exports=category 