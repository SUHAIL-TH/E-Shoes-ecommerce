const user = require("../model/usermodels");
const product = require("../model/productmodel");
const category = require("../model/categorymodel");
const cart = require("../model/cartmodel");

const viewproduct = async (req, res) => {
  try {
    let products = await product.find();
    res.render("admin/viewproduct", { products });
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};
const addproduct = async (req, res) => {
  try {
    let categoryData = await category.find();

    res.render("admin/addproduct", { categoryData });
  } catch (error) {
    console.log(error);
    res.render("admin/500");
  }
};
const postaddproduct = async (req, res) => {
  try {
    const image = [];
    for (i = 0; i < req.files.length; i++) {
      image[i] = req.files[i].filename;
    }
    const products = new product({
      productName: req.body.name,
      price: req.body.price,
      image: image,
      discription: req.body.discription,
      category: req.body.category,
      stock: req.body.stock,
    });

    await products.save();
    res.redirect("/admin/addproduct");
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};
const editproduct = async (req, res) => {
  try {
    let id = req.params.id;
    let categoryData = await category.find();
    let productData = await product.findOne({ _id: id });

    res.render("admin/editproduct", { productData, categoryData });
  } catch (error) {
    res.render("admin/500");
  }
};
const posteditproduct = async (req, res) => {
  try {
    let id = req.params.id;
    if (req.files.length != 0) {
      await product.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            productName: req.body.name,
            price: req.body.price,
            category: req.body.category,
            discription: req.body.discription,
            stock: req.body.stock,
            status: req.body.status,
          },
        }
      );
      for (i = 0; i < req.files.length; i++) {
        await product.findByIdAndUpdate(
          { _id: id },
          { $push: { image: req.files[i].filename } }
        );
      }
    } else {
      await product.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            productName: req.body.name,
            price: req.body.price,
            category: req.body.category,
            discription: req.body.discription,
            stock: req.body.stock,
            status: req.body.status,
          },
        }
      );
    }

    res.redirect("/admin/product");
  } catch (error) {
    res.render(admin / 500);
  }
};
const deleteproduct = async (req, res) => {
  try {
    let id = req.params.id;
    await product.deleteOne({ _id: id });
    res.redirect("/admin/product");
  } catch (error) {
    res.render("admin/500");
  }
};
const removeimage = async (req, res) => {
  try {
    let id = req.body.id;

    let position = req.body.position;
    let productImg = await product.findById(id);
    let image = productImg.image[position];
    await product.updateOne({ _id: id }, { $pullAll: { image: [image] } });
    res.json({ remove: true });
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////////////////user
const viewproductuser = async (req, res) => {
  try {
    let id = req.params.id;
    session = req.session.user;
    let categoryData = await category.find();
    let acname = await user.findOne({ email: session });
    let productData = await product.findOne({ _id: id });
    res.render("user/viewproduct", {
      categoryData,
      acname,
      product: productData,
    });
  } catch (error) {
    res.render("user/500");
    console.log(error);
  }
};
const searchproduct = async (req, res) => {
  try {
    let totalpage=2
    let categoryData = await category.find();
    let acname = await user.findOne({ email: req.session.user });
    let search = req.body.search.trim()
    let productData = await product.find({
      productName: { $regex: "^" + search, $options: "i" },
    });
    let filter="default"
    console.log(productData.length);
    if(productData!=0){
      res.render("user/shop", { categoryData, acname, product: productData,filter,totalpage });

    }else{
      res.render("user/shop", { categoryData, acname, product: productData,filter,totalpage });

    }
   
  } catch (error) {
    res.render("user/500");
    console.log(error);
  }
};

const categoryproduct = async (req, res) => {
  try {
    let id = req.query.id;
    let session = req.session.user;

    let categoryData = await category.find();
    let [categoryDatas] = await category.find({ _id: id });
    let acname = await user.findOne({ email: session });
    let products = await product.find({ category: categoryDatas.categoryName });
    res.render("user/categoryproduct", { acname, categoryData, products });
  } catch (error) {
    res.render("user/500");
    console.log(error);
  }
};

module.exports = {
  //admin side
  viewproduct,
  addproduct,
  postaddproduct,
  editproduct,
  posteditproduct,
  deleteproduct,
  removeimage,

  //user side
  viewproductuser,
  searchproduct,
  categoryproduct,
};
