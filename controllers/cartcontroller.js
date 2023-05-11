const user = require("../model/usermodels");
const product = require("../model/productmodel");
const category = require("../model/categorymodel");
const cart = require("../model/cartmodel");

//user cart controller
const getcart = async (req, res) => {
  try {
    var Total = 0;
    let session = req.session.user;
    let categoryData = await category.find();
    let acname = await user.findOne({ email: session });
    let cartData = await cart
      .findOne({ user: acname._id })
      .populate("product.productId");
    // console.log(cartData);

    // console.log(cartData  );
    if (cartData) {
      if (cartData.product != 0) {
        let total = await cart.aggregate([
          {
            $match: {
              user: acname._id,
            },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              price: "$product.price",
              quantity: "$product.quantity",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$price", "$quantity"] } },
            },
          },
        ]);
        Total = total[0].total;
        //  console.log(Total);
        res.render("user/cart", { acname, categoryData, cartData, Total });
      } else {
        res.render("user/cart", { acname, categoryData, cartData, Total });
      }
    } else {
      res.render("user/cart", { acname, categoryData, cartData, Total });
    }
  } catch (error) {
    res.render("user/500");
    console.log(error);
  }
};
const  addtocart = async (req, res) => {
  try {
    let id = req.params.id;
   
    let productData = await product.findOne({ _id: id });
    let acname = await user.findOne({ email: req.session.user });
    let cartData = await cart.findOne({ user: acname._id });
    if (cartData) {
      let proExit = await cartData.product.findIndex(
        (product) => product.productId == id
      );
      console.log(proExit);
      if (proExit != -1) {
        await cart.updateOne(
          { "product.productId": productData._id },
          { $inc: { "product.$.quantity": 1 } }
        );
        console.log("product quantity increased");
      } else {
        await cart.findOneAndUpdate(
          { user: acname._id },
          {
            $push: {
              product: {
                productId: productData._id,
                price: productData.price,
              },
            },
          }
        );
        console.log("product added to the cart");
      }
      // res.redirect("/")
      res.json({ status: true });
    } else {
      let carts = new cart({
        user: acname._id,
        product: [{ productId: productData._id, price: productData.price }],
      });
      await carts.save();
      console.log("new product added successfully");
      // res.redirect("/")
      res.json({ status: true });
    }
  } catch (error) {
    res.status(500).render("user/500");
    console.log(error);
  }
};
const removeproduct = async (req, res) => {
  try {
    let cartId = req.body.cart;
    let proId = req.body.product;

    await cart.updateOne(
      { _id: cartId, "product._id": proId },
      {
        $pull: { product: { _id: proId } },
      }
    );
    res.json({ remove: true });
  } catch (error) {
    res.render(user / 500);
    console.log(error);
  }
};
const changeproductquantity = async (req, res, next) => {
  try {
    let cartId = req.body.cart;
    let proId = req.body.product;
    let count = parseInt(req.body.count);
    let quantity = parseInt(req.body.quantity);
    let proprice = req.body.proprice;
    let userid = req.body.user;
    console.log(proId);

    let stockavailable=await product.findById(proId)
    console.log(stockavailable);
    console.log(quantity)
    if(stockavailable.stock>=quantity){
      
    }
    if ((count == -1) & (quantity == 1)) {
      await cart.updateOne(
        { _id: cartId, "product.productId": proId },
        {
          $pull: { product: { productId: proId } },
        }
      );
      res.json({ remove: true });
    } else {
      await cart.updateOne(
        { _id: cartId, "product.productId": proId },
        { $inc: { "product.$.quantity": count } }
      );
    }
    next();
  } catch (error) {
    console.log(error);
    res.render("admin/500");
  }
};
const totalproductprice = async (req, res) => {
  try {
    let userid = req.body.user;
    const users = await user.findOne({ email: req.session.user });

    let total = await cart.aggregate([
      {
        $match: {
          user: users._id,
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          price: "$product.price",
          quantity: "$product.quantity",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    let Total = total[0].total;
    res.json({ success: true, Total });
  } catch (error) {
    res.render("user/500");
  }
};

module.exports = {
  getcart,
  addtocart,
  removeproduct,
  totalproductprice,
  changeproductquantity,
};
