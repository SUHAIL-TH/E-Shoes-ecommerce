const bcrypt = require("bcrypt")
const user = require("../model/userModel")
const mailer = require("../middleware/otpValidation")
const randomString = require("randomstring")
const product = require("../model/productModel")
const category = require("../model/categoryModel")
const cart = require("../model/cartModel")
const nodemailer = require("nodemailer")
const order=require("../model/ordermodel")
const Razorpay=require("razorpay")
const coupon=require("../model/coupenmodel")
const wishlist=require("../model/wishlistmodel")
const banner=require("../model/bannermodel")

var instance = new Razorpay({
    key_id: 'rzp_test_Yp5AmFQqgmu2Nq',
    key_secret:process.env.RAZORKEY
  });



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
   
    let banners=await banner.find()
    let count=0;
    
    
  

    try {
        if (session) {
            let [cartcount]=await cart.aggregate([{$match:{user:acname._id}}])
            customer = true;
            if(cartcount){
                count= cartcount.product.length
               
                res.render("user/home", { customer, acname, productData, categoryData,count,banners })

            }else{
                 res.render("user/home", { banners,customer, acname, productData, categoryData,count, })

            }
            
           
        }
        else {
            customer = false
            res.render("user/home", { customer, acname, productData, categoryData,count ,banners})
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
const  postotp = async (req, res) => {
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
    
    // console.log(cartData  );
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
        //  console.log(Total);
            res.render("user/cart", { acname, categoryData,cartData,Total})
    
        }else{
      
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
        let quantity=parseInt(req.body.quantity)
        let proprice=req.body.proprice
        let userid=req.body.user
        console.log(proId);  
        
        // let stockavailable=await product.findById(proId)
        // if(stockavailable.stock>quantity){
            if(count==-1 &quantity==1) {
                await cart.updateOne({_id:cartId,"product.productId":proId},{
                    $pull:{product:{productId:proId}}
                })
                res.json({remove:true})
    
               }else{
               await cart.updateOne({_id:cartId,"product.productId":proId},{$inc:{"product.$.quantity":count}})
                
            
               }
               next()

        // }else{ }
            
         
         
    } catch (error) {
        console.log(error);
        res.render("admin/500")
        
    }

}
const checkout=async(req,res,next)=>{
    try {
        let categoryData = await category.find()
        let acname = await user.findOne({ email:req.session.user })
        // let productData = await product.find()
        let cartData=await cart.findOne({user:acname._id}).populate("product.productId")
        console.log(cartData);
        let walletamount=0;
        let Totalcart
        
        let Total=0
        if(cartData.product.length>0){
            let sum =await cart.aggregate([{
                $match:{
                    _id:cartData._id
                }
            },{$unwind:"$product"
    
            },{
                $project:{
                    price:"$product.price",quantity:"$product.quantity"
                }
            },{
                $group:{
                    _id:null,
                    total:{$sum:{$multiply:["$price","$quantity"]}}
                }
            }])
            Totalcart=sum[0].total

        
        }
        walletamount=acname.wallet
       
        if(walletamount>Totalcart){
            Total=0;
            const balances=walletamount-Totalcart
            await user.updateOne({email:req.session.user},{$set:{wallet:balances}})
        }else{
            Total=Totalcart-walletamount
            let n=0;
            await user.updateOne({email:req.session.user},{$set:{wallet:n}})

        }
       

        
        
       
       
        res.render("user/checkout", {  acname, categoryData,Total,walletamount,Totalcart,})
       
    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}
const removeproduct=async(req,res)=>{
    try {
        let cartId=req.body.cart
        let proId=req.body.product

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
        const data = await user.findOneAndUpdate({email:req.session.user},{$push:{address:{name:address.name,housename:address.housename,
            city:address.city,district:address.discrict,
            phone:address.phone,state:address.state,pincode:address.pincode}}})
        
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
const totalproductprice=async(req,res)=>{
    try {
        
        let userid=req.body.user
        const users=await user.findOne({email:req.session.user})

       let total =await cart.aggregate([{
            $match:{
                user:users._id
            }
        },{$unwind:"$product"

        },{
            $project:{
                price:"$product.price",quantity:"$product.quantity"
            }
        },{
            $group:{
                _id:null,
                total:{$sum:{$multiply:["$price","$quantity"]}}
            }
        }])
  
      let Total=total[0].total
       
       
       
        res.json({success:true,Total})
        
    } catch (error) {
        res.render("user/500")
    } 
     
}
const placeorder=async(req,res)=>{
    try {
       
        const address=req.body.address
        const amount=req.body.total
        const payment=req.body.payment
        const wallet=req.body.wallet
        console.log(req.body.couponcode);
        const userData=await user.findOne({email:req.session.user})
        const cartData=await cart.findOne({user:userData._id})
        const product=cartData.product
        const status=payment==="COD"?"placed":"pending"

 console.log(status);

        const newOrder=new order({
            deliveryDetails:address,
            user:userData._id,
            totalamount:amount,
            paymentMethode:payment,
            date:new Date(),
            status:status,
            product:product,
            wallet:wallet
        })
        await newOrder.save()
        let orderid=newOrder._id
        let totalAmount=newOrder.totalamount
       
        if(status=="placed"){
            await cart.deleteOne({user:userData._id})
            res.json({codsuccess:true})
           
        }else{
            console.log("entered to razopay");
            var options = {
                amount: totalAmount * 100,
                currency: "INR",
                receipt: ""+orderid,
              };
              instance.orders.create(options, function (err, order) {
                // console.log(order);
                res.json({ order });
              });

             
        }

        
    } catch (error) {
        res.render("user/500")
        console.log(error)
    }
}
const ordersuccess=async(req,res)=>{
    try {
        res.render("user/ordersuccess")
    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}
const vieworders=async(req,res)=>{
    try {

        let categoryData = await category.find()
        let acname = await user.findOne({ email: req.session.user })
       
        let orderData=await order.find({user:acname._id})
        res.render("user/vieworders",{ categoryData, acname,orderData})
        
    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}
const verifypayment=async(req,res)=>{
    try {
        let userData=await user.findOne({email:req.session.user})
       
        const details=(req.body);

    //    console.log(details);
        const crypto = require("crypto");
        let hmac=crypto.createHmac("sha256",process.env.RAZORKEY)
        hmac.update(details.payment.razorpay_order_id+'|'+details.payment.razorpay_payment_id)
        hmac=hmac.digest('hex')
        if(hmac==details.payment.razorpay_signature){
            await order.findByIdAndUpdate({
                _id:details.order.receipt
            },
            {$set:{paymentId:details.payment.razorpay_payment_id}})
          
            await order.findByIdAndUpdate({_id:details.order.receipt},{$set:{status:"placed"}})
            await cart.deleteOne({user:userData._id})
            res.json({success:true})
        }else{
            await order.deleteOne({ _id:details.order.receipt });
            res.json({ success: false });
    
        }
        
    } catch (error) {
        console.log(error)
        res.render("user/500")
        
    }
}
const orderedproduct=async(req,res)=>{
    try {
        let id=req.params.id
        let categoryData = await category.find()
        let acname = await user.findOne({ email: req.session.user })
        let orderData=await order.findById({_id:id}).populate("product.productId")
        // console.log(orderData);
        res.render("user/orderedproduct",{categoryData, acname,orderData})
        
    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}
const applycoupon=async(req,res)=>{
    try {
        let userexist=false
        let code=req.body.code
        let amount=req.body.amount
        let userData=await user.findOne({email:req.session.user});
       
        
         userexist=await coupon.findOne({couponcode:code,used:{$in:[userData._id]}})
       
        if(userexist){
            res.json({user:true})
        }else{
            const couponData=await coupon.findOne({couponcode:code})
            
            console.log("coupondata"+couponData);
            if(couponData){
                if(couponData.expiredate>=new Date()){
                   
                    if(couponData.limit!=0){
                        
                        if(couponData.mincartamount<=amount){
                            let n=-1
                          await coupon.findByIdAndUpdate({_id:couponData._id},{$push:{used:userData._id}})
                          await coupon.findByIdAndUpdate({_id:couponData._id},{$inc:{limit:n}})
                         
                         
                            if(couponData.couponamounttype=="Fixed"){
                                let discountvalue=couponData.couponamount
                                
                                let distotal=Math.round(amount-discountvalue)
                               return res.json({couponokey:true,
                                    
                                    distotal,
                                    discountvalue,
                                    code
                                })
    
                            }else if(couponData.couponamounttype=="Percentage"){
                             
                                let discountvalue=(amount*couponData.couponamount)/100
                               
                                if(discountvalue<=couponData.maxredeemamount){
                                    let distotal=Math.round(amount-discountvalue)
                                   return res.json({couponokey:true,distotal,code,discountvalue })
    
                                }else{
                                    let distotal=Math.round(amount-discountvalue)
                                    
                                   return res.json({couponokey:true,code,distotal,discountvalue})
                                }
                            }
                        }else{
                            res.json({cartamount:true})
                        }
                    }else{
                        res.json({limit:true})
                    }
                }else{
                    res.json({expire:true})
                }
            }else{
                res.json({invalid:true})
            }
        }
        
    } catch (error) {
        res.render("user/500")
        console.log(error);
    }
}
const addtowishlist=async(req,res)=>{
    try {
        let id=req.body.id
      
     
       let productData=await product.findOne({_id:id})
       let acname=await user.findOne({email:req.session.user})
       let wishlistData=await wishlist.findOne({user:acname.id})
       console.log(acname._id);
    
    
       if(wishlistData){
       let wishExits=await wishlistData.product.findIndex((product)=>product.productId==id)
      
            if(wishExits!=-1){
                res.json({productExit:true})
            }else{
               
            await wishlist.findOneAndUpdate({user:acname._id},{
                    $push:{product:{productId:productData._id,name:productData.name,price:productData.price}}
                })
           
            }
            res.json({status:true})

       }else{
        let wishlists=new wishlist({
            user:acname._id,
            product:[{productId:id,name:productData.productName,price:productData.price}]
            
        })
        await wishlists.save()
        res.json({status:true})
        
       }
       

        
    } catch (error) {
        res.render("user/500")
        console.log(error)
    }

}
const viewwishlist=async(req,res)=>{
    try {
        let categoryData = await category.find()
        let acname = await user.findOne({ email: req.session.user })
        let wishlistData=await wishlist.findOne({user:acname._id}).populate("product.productId")
        if(wishlistData){
            if(wishlistData.product!=0){
                res.render("user/wishlist",{acname,categoryData,wishlistData})

            }else{
                res.render("user/wishlist",{acname,categoryData,data:'hi'})

            }
          

        }else{
            res.render("user/wishlist",{acname,categoryData,data:'hi'})
        }
        

        
        
    } catch (error) {
        res.render("user/500")
        log(error)
    }
}
const removewishlist=async(req,res)=>{
    try {
        let id=req.body.id
        let hii=await wishlist.findOneAndUpdate({"product.productId":id},{$pull:{product:{productId:id}}})
        console.log(hii);
        res.json({status:true})
    } catch (error) {
        res.render("user/500")
        console.log(error)
    }
}
const wishtocart=async(req,res)=>{
    try {
        let id = req.body.id
      
    
  
        let productData = await product.findOne({ _id: id })
        let acname = await user.findOne({ email: req.session.user })
        let cartData = await cart.findOne({ user: acname._id })
        if (cartData) {

            let proExit = await cartData.product.findIndex((product) => product.productId == id
            )
           
            if (proExit != -1) {
                await cart.updateOne({ "product.productId": productData._id }, { $inc: { 'product.$.quantity': 1 } })
                await wishlist.findOneAndUpdate({user:acname._id},{$pull:{product:{productId:id}}})

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
          
            res.json({status:true})
        } else {
            let carts = new cart({
                user: acname._id,
                product: [{ productId: productData._id, price: productData.price }]
            })
            await carts.save()
            await wishlist.findOneAndUpdate({user:acname._id},{$pull:{product:{productId:id}}})
            
          
            res.json({status:true})
        }

        
    } catch (error) {
        res.render("user/500")
        console.log(error)
    }
}
const cancelorder=async(req,res)=>{
    try {

        let id =req.body.id
        let orderData=await order.findOne({_id:id})
        if(orderData.paymentMethode=="COD"){
            await user.findOneAndUpdate({email:req.session.user},{$inc:{wallet:orderData.wallet}})
            await order.findByIdAndUpdate({_id:id},{$set:{status:"canceled"}})   

        }else{
            await user.findOneAndUpdate({email:req.session.user},{$inc:{wallet:orderData.totalamount}})
            await order.findByIdAndUpdate({_id:id},{$set:{status:"canceled"}})   

            
        }
       
        res.json({status:true})     
    } catch (error) {
        res.render("user/500")
        console.log(error)
    }
}
const returnorder=async(req,res)=>{
    try {
        let id=req.body.id
        await order.findOneAndUpdate({_id:id},{$set:{status:"return pending"}})
        res.json({status:true})   
         
    } catch (error) {
        res.render("user/500")
        console.log(error)
    }
}
const searchproduct=async (req,res)=>{
    try {
        let categoryData = await category.find()
        let acname = await user.findOne({ email: req.session.user })
        let search=req.body.search
        let productData= await product.find({productName:{$regex:'^'+search,$options:'i'}})
        res.render("user/shop",{categoryData,acname,product:productData})
        
    } catch (error) {
        res.render("user/500")
        console.log(error)
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
    deleteaddress,
    totalproductprice,
    placeorder,
    ordersuccess,
    vieworders,
    verifypayment,
    orderedproduct,
    applycoupon,
    addtowishlist,
    viewwishlist,
    removewishlist,
    wishtocart,
    cancelorder,
    returnorder,
    searchproduct
    
    

}