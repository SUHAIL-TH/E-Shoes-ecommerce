module.exports={
    verifyLoginAdmin:(req,res,next)=>{
        if(req.session.admin){
            next()
        }else{
            res.redirect("/admin")
        }
    },
    verifyUserLogin:(req,res,next)=>{
        if(req.session.user){
            next()
        }else{
            res.redirect('/login')

        }

    }
}