const randomString = require("randomstring");
const admin = require("../model/adminmodel");
const user = require("../model/usermodels");
const product = require("../model/productmodel");
const category = require("../model/categorymodel");
const order = require("../model/ordermodel");
const uc = require("upper-case");
const coupon = require("../model/coupenmodel");
const banner = require("../model/bannermodel");

///////////////////////////////admin side
const viewcoupon = async (req, res) => {
  try {
    let couponData = await coupon.find();
    res.render("admin/viewcoupon", { couponData });
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};
const addcoupon = async (req, res) => {
  try {
    res.render("admin/addcoupon");
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};
const postaddcoupon = async (req, res) => {
  try {
    let couponData = req.body;
    console.log(req.body);
    let coupons = new coupon({
      couponcode: req.body.name,
      couponamounttype: req.body.coupontype,
      couponamount: req.body.amount,
      mincartamount: req.body.mincart,
      maxredeemamount: req.body.maxredeem,
      expiredate: req.body.date,
      limit: req.body.limit,
    });
    await coupons.save();
    res.redirect("/admin/viewcoupon");
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};
const removecoupon = async (req, res) => {
  try {
    let id = req.body.id;
    await coupon.findByIdAndRemove({ _id: id });
    res.json("removed:true");
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};
const editcoupon = async (req, res) => {
  try {
    id = req.params.id;
    let couponData = await coupon.findOne({ _id: id });
    res.render("admin/editcoupon", { couponData });
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};
const posteditcoupon = async (req, res) => {
  try {
    let id = req.params.id;
    await coupon.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          couponcode: req.body.name,
          couponamounttype: req.body.coupontype,
          couponamount: req.body.amount,
          mincartamount: req.body.mincart,
          maxredeemamount: req.body.maxredeem,
          expiredate: req.body.date,
          limit: req.body.limit,
        },
      }
    );

    res.redirect("/admin/viewcoupon");
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};

/////////////////////////////////////////////////////user side

const applycoupon = async (req, res) => {
  try {
    let userexist = false;
    let{ code,amount }= req.body;
    // let amount = req.body.amount;
    let userData = await user.findOne({ email: req.session.user });

    userexist = await coupon.findOne({
      couponcode: code,
      used: { $in: [userData._id] },
    });

    if (userexist) {
      res.json({ user: true });
    } else {
      const couponData = await coupon.findOne({ couponcode: code });

      console.log("coupondata" + couponData);
      if (couponData) {
        if (couponData.expiredate >= new Date()) {
          if (couponData.limit != 0) {
            if (couponData.mincartamount <= amount) {
              let n = -1;
              await coupon.findByIdAndUpdate(
                { _id: couponData._id },
                { $push: { used: userData._id } }
              );
              await coupon.findByIdAndUpdate(
                { _id: couponData._id },
                { $inc: { limit: n } }
              );

              if (couponData.couponamounttype == "Fixed") {
                let discountvalue = couponData.couponamount+userData.wallet

                let distotal = Math.round(amount - discountvalue);
                return res.json({
                  couponokey: true,

                  distotal,
                  discountvalue,
                  code,
                });
              } else if (couponData.couponamounttype == "Percentage") {
                let discountvalue = (amount * couponData.couponamount) / 100;

                if (discountvalue <= couponData.maxredeemamount) {
                  let distotal = Math.round(amount - discountvalue+userData.wallet)
                  return res.json({
                    couponokey: true,
                    distotal,
                    code,
                    discountvalue,
                  });
                } else {
                  let distotal = Math.round(amount - discountvalue);

                  return res.json({
                    couponokey: true,
                    code,
                    distotal,
                    discountvalue,
                  });
                }
              }
            } else {
              res.json({ cartamount: true });
            }
          } else {
            res.json({ limit: true });
          }
        } else {
          res.json({ expire: true });
        }
      } else {
        res.json({ invalid: true });
      }
    }
  } catch (error) {
    res.render("user/500");
    console.log(error);
  }
};

module.exports = {
  // admin
  viewcoupon,
  addcoupon,
  postaddcoupon,
  editcoupon,
  posteditcoupon,
  removecoupon,

  //user side
  applycoupon,
};
