const bcrypt = require("bcrypt")
const user = require("../model/userModel")
const mailer = require("../middleware/otpValidation")
const randomString = require("randomstring")
const product = require("../model/productModel")
const category = require("../model/categoryModel")
const cart = require("../model/cartModel")
const nodemailer = require("nodemailer")
const { isValidObjectId } = require("mongoose")


let name
let email
let phone
let password
const sendresetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "eshoes518@gmail.com",
                pass: process.env.PASS
            }
        })
        let mailOption = {
            from: "eshoes518@gmail.com",
            to: email,
            subject: "Link for reset password",
            html: '<p>Hi ..' + name + ' plzee copy the link in Browser and <a href="http://localhost:4000/resetpassword?token=' + token + '">Reset</a> your password.</p>'
        }
        transporter.sendMail(mailOption, function (error, infor) {
            if (error) {
                console.log(error);
            } else {
                console.log("mail has been send to the email");

            }
        })



    } catch (error) {
        console.log(error);

    }

}

const home = async (req, res) => {
    let session = req.session.user;
    let acname = await user.findOne({ email: session })
    let productData = await product.find().limit(8)
    let categoryData = await category.find()

   let count=0;
    
    
  

    try {
        if (session) {
            let [cartcount]=await cart.aggregate([{$match:{user:acname._id}}])
            customer = true;
            if(cartcount){
                count= cartcount.product.length
               
                res.render("user/home", { customer, acname, productData, categoryData,count })

            }else{
                 res.render("user/home", { customer, acname, productData, categoryData,count })

            }
            
           
        }
        else {
            customer = false
            res.render("user/home", { customer, acname, productData, categoryData,count })
        }

    } catch (error) {
        res.render("user/500")
        console.log(error);

    }


}


const login = (req, res) => {
    if (req.session.user) {
        res.redirect("/")
    } else {
        res.render("user/login")

    }

}
const signup = (req, res) => {
    res.render("user/signup")
}

const postsignup = async (req, res) => {

    name = req.body.name
    email = req.body.email
    phone = req.body.phone
    password = await bcrypt.hash(req.body.password, 10)

    console.log(mailer.OTP);

    let mailDetails = {
        from: "eshoes518@gmail.com",
        to: email,
        subject: "Otp for E-shoes varification",
        html: `<p>Hi ${name} ..Your OTP FOR registration on E-SHOES:  ${mailer.OTP}<P>`,
    };

    let users = await user.findOne({ email: email })
    try {
        if (users) {
            res.render("user/signup", { error: "User already exsisted" })
        } else {
            mailer.mailerTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("user/otp", { name, email, phone, password })
                    console.log("otp has sented");
                }
            });
        }

    } catch (error) {
        res.render("user/500")

    }


}
const postotp = async (req, res) => {
    let otp = req.body.otp
    try {
        if (mailer.OTP == otp) {
            await user.create({
                name: name,
                email: email,
                phone: phone,
                password: password,
            })
            // await user.updateMany({ email: email }, { $set: { isVerified: true } })
            res.render("user/login")

        } else {
            res.render("user/otp", { error: "Invalid OTP" })
        }

    } catch (error) {
        res.render("user/500")

    }

}
const postlogin = async (req, res) => {

    let email = req.body.email
    let password = req.body.password
    try {
        let acname = await user.findOne({ email: email })
        if (acname) {
            let passwordMatch = await bcrypt.compare(password, acname.password)
            if (acname.blocked === false) {
                if (passwordMatch) {
                    req.session.user = email

                    res.redirect("/")
                } else {
                    res.render("user/login", { error: "Invalid username or password" })
                }

            } else {
                res.render("user/login", { error: "Your are blocked " })

            }

        } else {
            res.render("user/login", { error: "Email doesn't exist" })
        }

    } catch (error) {

        res.render("user/500")
    }

}
const logout = (req, res) => {
    req.session.user = false;
    res.redirect("/")
}
const forgetpassword = (req, res) => {
    res.render("user/forgetpassword")
}
const postforgetpassword = async (req, res) => {
    try {
        const email = req.body.email
        const acname = await user.findOne({ email: email })

        if (acname) {
            if (acname.blocked === false) {
                const randomstring = randomString.generate()
                const data = await user.updateOne({ email: email }, { $set: { token: randomstring } })
                sendresetPasswordMail(acname.name, acname.email, randomstring)
                res.render("user/forgetpassword", { Msg: "please check you email and reset password" })
            } else {
                res.render("user/forgetpassword", { Msg: "This email is blocked" })
            }




        } else {
            res.render("user/forgetpassword", { Msg: "Email is not found" })
        }

    } catch (error) {
        res.render("user/500")

    }

}
const getshop = async (req, res) => {
    try {
        session = req.session.user
        let categoryData = await category.find()
        let acname = await user.findOne({ email: session })
        let productData = await product.find()
        res.render("user/shop", { product: productData, acname, categoryData })
    } catch (error) {
        res.render("user/500")
        console.log(error);

    }
}
const profile=async(req,res)=>{
    try {
        
        let userData=await user.findOne({email:req.session.user})
        res.render("user/userprofile",{userData})
    } catch (error) {
        res.render("user/500")
    }
}
const postprofile=async(req,res)=>{
    try {
       
        let name=req.body.name
        let email=req.body.email
        let phone=req.body.phone
        let password=await bcrypt.hash(req.body.password, 10)
       
        
        await user.updateOne({email:req.session.user},{$set:{name:name,email:email,phone:phone,password:password}})

        res.redirect("/")

        
    } catch (error) {
        res.render("user/500")
    }
}
// const viewproduct = async (req, res) => {
//     try {
//         let id = req.params.id
//         session = req.session.user
//         let categoryData = await category.find()
//         let acname = await user.findOne({ email: session })
//         let productData = await product.findOne({ _id: id })

//         res.render("user/viewproduct", { categoryData, acname, product: productData })

//     } catch (error) {
//         res.render("user/500")
//         console.log(error);
//     }
// }


// const categoryproduct = async (req, res) => {
//     try {
//         let id = req.query.id
//         let session = req.session.user
    
       
      
//         let categoryData = await category.find()
//         let [categoryDatas] = await category.find({ _id: id })
//         let acname = await user.findOne({ email: session })
//         let products = await product.find({ category: categoryDatas.categoryName })
//         res.render("user/categoryproduct", { acname, categoryData, products })

//     } catch (error) {
//         res.render("user/500")
//         console.log(error);
//     }
// }
const getcart = async (req, res) => {
    try {
        var Total=0
        let session = req.session.user
        let categoryData = await category.find()
        let acname = await user.findOne({ email: session })
    //     let cartData = await cart.aggregate([{
    //         $match: { user: acname._id }
    //     }, {
    //         $unwind: "$product"
    //     }, { $project: { productId:"$product.productId" ,quantity:"$product.quantity"} }, {
    //         $lookup:{
    //             from:"products",
    //             localField:"productId",
    //             foreignField:"_id",
    //             as:"product"

    //         }
    //     }
    //  ])
    //     console.log(cartData[1].product);

    

    let cartData=await cart.findOne({user:acname._id}).populate("product.productId")
    
    console.log(cartData  );
    if(cartData){
        if(cartData.product!=0){
            let total=await cart.aggregate([{
                $match:{
                    user:acname._id
                }
            },
            {
                $unwind:"$product"
            },{
            $project:{
                price:"$product.price",quantity:"$product.quantity"
            }
            },
            {
                $group:{
                    _id:null,
                    total:{$sum:{$multiply:["$price","$quantity"]}}
                }
            }
        ])
         Total=total[0].total  
         console.log(Total);
            res.render("user/cart", { acname, categoryData,cartData,Total})
    
        }else{
       console.log("hii");
            res.render("user/cart", { acname, categoryData,cartData,Total})
    
    
        }

        }
        else{
       
        res.render("user/cart", { acname, categoryData,cartData,Total})


    }
       

    } catch (error) {
        res.render("user/500")
        console.log(error);

    }
}
const getresetpassword = (req, res) => {
    try {
        let token = req.query.token

        res.render("user/resetpassword", { token })
    } catch (error) {
        res.render("user/500")
    }

}
const resetpassword = async (req, res) => {
    try {
        let token = req.body.token
        const acname = await user.findOne({ token: token })

        if (acname) {
            let password = await bcrypt.hash(req.body.password, 10)
            await user.updateOne({ _id: acname.id }, { $set: { password: password, token: "" } })
            res.redirect("/login")

        } else {
            res.render("user/resetpassword", { Msg: "link has been expired" })
        }

    } catch (error) {
        res.render("admin/500")
        console.log(error);

    }

}

const addtocart = async (req, res) => {
    try {
        let id = req.params.id
        let categoryData = await category.find()
        let productData = await product.findOne({ _id: id })
        let acname = await user.findOne({ email: req.session.user })
        let cartData = await cart.findOne({ user: acname._id })
        if (cartData) {

            let proExit = await cartData.product.findIndex((product) => product.productId == id
            )
            console.log(proExit);
            if (proExit != -1) {
                await cart.updateOne({ "product.productId": productData._id }, { $inc: { 'product.$.quantity': 1 } })
                console.log("product quantity increased");

            } else {
                await cart.findOneAndUpdate({ user: acname._id }, {
                    $push: {
                        product: {
                            productId: productData._id,price:productData.price
                        }
                    }
                })
                console.log("product added to the cart");
            }
            // res.redirect("/")
            res.json({status:true})
        } else {
            let carts = new cart({
                user: acname._id,
                product: [{ productId: productData._id, price: productData.price }]
            })
            await carts.save()
            console.log("new product added successfully");
            // res.redirect("/")
            res.json({status:true})
        }


    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}
const changeproductquantity=async(req,res,next)=>{
    try {
       
        let cartId=req.body.cart
        let proId=req.body.product
        let count=parseInt(req.body.count)
        let quantity=req.body.quantity

      
      
        
        
        
            
           if(count==-1 &quantity==1) {
            await cart.updateOne({_id:cartId,"product._id":proId},{
                $pull:{product:{_id:proId}}
            })
            res.json({quantity:true})

           }else{
            
           
            await cart.updateOne({_id:cartId,"product._id":proId},{$inc:{"product.$.quantity":count}})
           res.json({success:true})
           }
    } catch (error) {
        console.log(error);
        res.render("admin/500")
        
    }

}
const checkout=async(req,res,next)=>{
    try {
        let total=req.query.total

        let categoryData = await category.find()
        let acname = await user.findOne({ email:req.session.user })
        let productData = await product.find()
        res.render("user/checkout", { product: productData, acname, categoryData,total })
       
    } catch (error) {
        res.render("user/500")
    }
}
const removeproduct=async(req,res)=>{
    try {
        let cartId=req.body.cart
        let proId=req.body.product
        
        console.log("hello suhail");

        await cart.updateOne({_id:cartId,"product._id":proId},{
            $pull:{product:{_id:proId}}
        })       
         res.json({remove:true})



        
    } catch (error) {
        res.render(user/500)
        console.log(error);
    }
}
const addaddress=async(req,res)=>{
    try {
        let address=req.body
        const data = await user.findOneAndUpdate({email:req.session.user},{$push:{address:{name:address.name,housename:address.housename,city:address.city,district:address.discrict,phone:address.phone,state:address.state}}})
        
        res.redirect("/checkout")
        
    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}
const deleteaddress=async(req,res)=>{
    try {
        let id=req.params.id
        await user.findOneAndUpdate({email:req.session.user},{$pull:{address:{_id:id}}})
        res.redirect("/checkout")
        
    } catch (error) {
        console.log(error);
        res.render("user/500")
    }

}


module.exports = {
    home,
    login,
    signup,
    postsignup,
    postotp,
    postlogin,
    logout,
    forgetpassword,
    postforgetpassword,
    getshop,
    // viewproduct,
    // categoryproduct,
    getcart,
    getresetpassword,
    resetpassword,
    addtocart,
    changeproductquantity,
    profile,
    postprofile,
    checkout,
    removeproduct,
    addaddress,
    deleteaddress
    

}