const mongoose=require("mongoose")
const crypt=require("bcrypt")

module.exports={
    home:(req,res)=>{
        res.render("admin/index")
    }

}
