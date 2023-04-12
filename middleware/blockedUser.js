// const user=require("../model/userModel")
// const isblocked=(async(req,res,next)=>{
//     if(req.session.user){
//         let email=req.session.user
//     const data = await user.findOne({email: email})
//         if(data.blocked===true){    
//         res.redirect('/logout')
//         }
//         else{
//             next()
//         }      
//     }else{
//         next()
//     }   
// })

// module.exports=isblocked;