const bcrypt=require("bcrypt")
const admin=require("../model/adminModel")


  
const login=(req,res)=>{
        if(req.session.admin){
            res.redirect("/admin/home")

        }else{
            res.render("admin/login")
        }
       
    }
const postlogin=async(req,res)=>{
        let email=req.body.email
        let password=req.body.password
        let adminData= await admin.findOne({email:email})
        console.log(adminData);
       try {
        if(adminData){
            if(password==adminData.password){
                req.session.admin=email;
                res.redirect("/admin/home")
            }else{
                res.render("admin/login",{error:"Invalid password"})

            }

        }else{
            res.render("admin/login",{error:"Invalid email"})

        }
        
       } catch (error) {
        res.render("admin/500")
        console.log(error);

        
       }
    }
 const home=(req,res)=>{
        if(req.session.admin){
            res.render("admin/index")

        }else{
            res.redirect("/admin")
        }
        
    }


module.exports={
    login,
    postlogin,
    home,


}
