const user = require("../model/usermodels");
const product = require("../model/productmodel");
const category = require("../model/categorymodel");
const cart = require("../model/cartmodel");
const wishlist = require("../model/wishlistmodel");

const addtowishlist = async (req, res) => {
  try {
    let id = req.body.id;

    let productData = await product.findOne({ _id: id });
    let acname = await user.findOne({ email: req.session.user });
    let wishlistData = await wishlist.findOne({ user: acname.id });
    console.log(acname._id);

    if (wishlistData) {
      let wishExits = await wishlistData.product.findIndex(
        (product) => product.productId == id
      );

      if (wishExits != -1) {
        res.json({ productExit: true });
      } else {
        await wishlist.findOneAndUpdate(
          { user: acname._id },
          {
            $push: {
              product: {
                productId: productData._id,
                name: productData.name,
                price: productData.price,
              },
            },
          }
        );
      }
      res.json({ status: true });
    } else {
      let wishlists = new wishlist({
        user: acname._id,
        product: [
          {
            productId: id,
            name: productData.productName,
            price: productData.price,
          },
        ],
      });
      await wishlists.save();
      res.json({ status: true });
    }
  } catch (error) {
    res.render("user/500");
    console.log(error);
  }
};
const viewwishlist = async (req, res) => {
  try {
    let categoryData = await category.find();
    let acname = await user.findOne({ email: req.session.user });
    let wishlistData = await wishlist
      .findOne({ user: acname._id })
      .populate("product.productId");
    if (wishlistData) {
      if (wishlistData.product != 0) {
        res.render("user/wishlist", { acname, categoryData, wishlistData });
      } else {
        res.render("user/wishlist", { acname, categoryData, data: "hi" });
      }
    } else {
      res.render("user/wishlist", { acname, categoryData, data: "hi" });
    }
  } catch (error) {
    res.render("user/500");
    log(error);
  }
};
const removewishlist = async (req, res) => {
  try {
    let id = req.body.id;
    let hii = await wishlist.findOneAndUpdate(
      { "product.productId": id },
      { $pull: { product: { productId: id } } }
    );
    console.log(hii);
    res.json({ status: true });
  } catch (error) {
    res.render("user/500");
    console.log(error);
  }
};
const wishtocart = async (req, res) => {
  try {
    let id = req.body.id;

    let productData = await product.findOne({ _id: id });
    let acname = await user.findOne({ email: req.session.user });
    let cartData = await cart.findOne({ user: acname._id });
    if (cartData) {
      let proExit = await cartData.product.findIndex(
        (product) => product.productId == id
      );

      if (proExit != -1) {
        await cart.updateOne(
          { "product.productId": productData._id },
          { $inc: { "product.$.quantity": 1 } }
        );
        await wishlist.findOneAndUpdate(
          { user: acname._id },
          { $pull: { product: { productId: id } } }
        );
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
        await wishlist.findOneAndUpdate(
          { user: acname._id },
          { $pull: { product: { productId: id } } }
        );
        console.log("product added to the cart");
      }

      res.json({ status: true });
    } else {
      let carts = new cart({
        user: acname._id,
        product: [{ productId: productData._id, price: productData.price }],
      });
      await carts.save();
      await wishlist.findOneAndUpdate(
        { user: acname._id },
        { $pull: { product: { productId: id } } }
      );

      res.json({ status: true });
    }
  } catch (error) {
    res.render("user/500");
    console.log(error);
  }
};

module.exports = {
  addtowishlist,
  viewwishlist,
  removewishlist,
  wishtocart,
};
