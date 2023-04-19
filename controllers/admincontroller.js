
const admin = require("../model/adminmodel")
const user = require("../model/usermodels")
const product = require("../model/productmodel")
const category = require("../model/categorymodel")
const order = require("../model/ordermodel")
const uc = require("upper-case")
const coupon = require("../model/coupenmodel")
const excel = require("exceljs")
const banner = require("../model/bannermodel")
const moment = require("moment")
const puppeteer=require("puppeteer")
moment().format()
//html to pdf generate required things
const ejs = require("ejs")
// const pdf = require("html-pdf")
const fs = require("fs")
const path = require("path")










const login = (req, res) => {
    if (req.session.admin) {
        res.redirect("/admin/home")
    } else {
        res.render("admin/login")
    }

}
const postlogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let adminData = await admin.findOne({ email: email })
    try {
        if (adminData) {
            if (password == adminData.password) {
                req.session.admin = email;
                res.redirect("/admin/home")
            } else {
                res.render("admin/login", { error: "Invalid password" })
            }

        } else {
            res.render("admin/login", { error: "Invalid email" })

        }

    } catch (error) {
        res.render("admin/500")
        console.log(error);
    }
}
const home = async (req, res) => {
    try {
        let productscount = await product.find().count()
        const totalRevenue = await order.aggregate([{ $match: { $and: [{ status: { $ne: "canceled" } }, { status: { $ne: "return aproved" } }] } }, { $group: { _id: null, total: { $sum: "$totalamount" } } }])

        const activeProduct = await product.find({ status: true }).count()
        const activeUsers = await user.find({ blocked: false }).count()
        const blockedUsers = await user.find({ blocked: true }).count()
        const deliveredCount = await order.find({ status: "Delivered" }).count()
        const totalOrder = await order.find().count()

        const orderCanceled = await order.find({ status: "canceled" }).count()
        const orderplaced = await order.find({ status: "placed" }).count()
        const ordershipped = await order.find({ status: "shipping" }).count()

        const categoryCount = await category.find().count()
        const activeCategory = await category.find({ status: true }).count()
        // const couponCount = await coupon.find().count()
        const paymentCount = await order.aggregate([{ $group: { _id: "$paymentMethode", count: { $count: {} } } }])
        const start = moment().startOf('day');
        // const end = moment().endOf('month');

        //year sales   
        const currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        
        let todayRevenue=await order.aggregate([{$match:{status:{$ne:"canceled"},createdAt:{$gte:currentDate}}},{$group:{_id:null,total:{$sum:"$totalamount"},count:{$sum:1}}}])
        
        let sales = []
        var date = new Date();
        var year = date.getFullYear();
        var currentYear = new Date(year, 0, 1);




        let salesByYear = await order.aggregate([
            { $match: { createdAt: { $gte: currentYear }, status: { $ne: "canceled" } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$createdAt" } },
                    total: { $sum: "$totalamount" },
                    count: { $sum: 1 }
                }
            }, { $sort: { _id: 1 } }
        ])
        for (let i = 1; i <= 12; i++) {
            let result = true;
            for (k = 0; k < salesByYear.length; k++) {
                result = false;
                if (salesByYear[k]._id == i) {
                    sales.push(salesByYear[k])
                    break;
                } else {
                    result = true
                }

            }

            if (result) sales.push({ _id: i, total: 0, count: 0 });
        }

        let salesData = []
        for (let i = 0; i < sales.length; i++) {
            salesData.push(sales[i].total)
        }






        res.render("admin/index", {
            productscount, activeProduct
            , totalOrder,
            activeUsers,
            blockedUsers,
            deliveredCount,
            orderCanceled,orderplaced,ordershipped, categoryCount, activeCategory, paymentCount, totalRevenue, salesData,todayRevenue

        })

    } catch (error) {
        res.render("admin/500")
        console.log(error)

    }

}
const logout = (req, res) => {
    req.session.admin = false,
        res.redirect("/admin")

}
const viewusers = async (req, res) => {

    try {
        const allusers = await user.find({})
        res.render("admin/allusers", { allusers })
    } catch (error) {
        res.render("admin/500")

    }


}
const blockuser = async (req, res) => {
    try {
        let id = req.params.id
        console.log(id);
        await user.updateOne({ _id: id }, { $set: { blocked: true } })
        res.redirect("/admin/viewusers")
    } catch (error) {
        res.render("admin/500")
    }

}
const unblockuser = async (req, res) => {
    try {
        let id = req.params.id
        await user.updateOne({ _id: id }, { $set: { blocked: false } })
        res.redirect("/admin/viewusers")
    } catch (error) {
        res.render("admin/500")
        console.log(error);
    }
}

const orders = async (req, res) => {
    try {
        let orderData = await order.find()

        res.render("admin/orders", { orderData })

    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const orderdetails = async (req, res) => {
    try {
        let id = req.params.id
        let orderData = await order.findById({ _id: id }).populate("product.productId")
        res.render("admin/orderdetails", { orderData })

    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
const updatestatus = async (req, res) => {
    try {
        let id = req.body.id
        let orderData = await order.findOne({ _id: id })

        let status = req.body.status
        if (status == "return aproved") {
            await user.findOneAndUpdate({ _id: orderData.user }, { $inc: { wallet: orderData.totalamount } })
        }

        await order.findByIdAndUpdate({ _id: id }, { $set: { status: status } })
        res.redirect("/admin/orders")

    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}



const excelorder = async (req, res) => {
    try {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet("orders")
        worksheet.columns = [
            { header: "No:", key: "no" },
            { header: "User Id", key: "user", width: 30 },
            { header: "Delivery Address", key: "deliveryDetails", width: 30 },
            { header: "Products", key: "product", width: 30 },
            { header: "Amount", key: "totalamount", },
            { header: "Date", key: "date", width: 20 },
            { header: "Status", key: "status" },
            { header: "Payment type", key: "paymentMethode" },
        ]
        let counter = 1;
        const orderData = await order.find({})
        orderData.forEach((orders) => {
            orders.no = counter;
            worksheet.addRow(orders)

            counter++
        })
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        })
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
        )
        res.setHeader("Content-Disposition", `attachment; filename=orders.xlsx`);
        return workbook.xlsx.write(res).then(() => {
            res.status(200);

        })

    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}

const salesreport = async (req, res) => {
    try {
        const orderData = await order.find({ status: { $ne: "canceled" } }).sort({ date: -1 })
        res.render("admin/salesreport", { orderData })

    } catch (error) {
        res.render("admin/500")
        console.log(error)
    }
}
// const pdforder = async (req, res) => {
//     try {
//         let orders = await order.find({ status: { $ne: "canceled" } }).sort({ data: -1 })
//         const data = {
//             orders: orders
//         }
//         const filePathName = path.resolve(__dirname, '../views/admin/htmltopdf.ejs')
//         const htmlString = fs.readFileSync(filePathName).toString()
//         let options = {
//             format: 'Letter',

//         }
//         const ejsData = ejs.render(htmlString, data)
//         pdf.create(ejsData, options).toFile('orders.pdf', (err, response) => {
//             if (err) console.log(err)
//             const filePath = path.resolve(__dirname, '../orders.pdf')
//             fs.readFile(filePath, (err, file) => {
//                 if (err) {
//                     console.log(err)
//                     return res.status(500).send('could not download file');
//                 }
//                 res.setHeader('Content-Type', 'application/pdf')
//                 res.setHeader('Content-Disposition', 'attachment;filename="orders.pdf')
//                 res.send(file);
//             })

//         })

//     } catch (error) {
//         res.render("admin/500")
//         console.log(error);
//     }
// }

const pdforder=async(req,res)=>{
    try {
        const value = req.query.value
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(`https://e-shoes.online/admin/htmltopdf` , {
        waitUntil:"networkidle2"
        })
        await page.setViewport({width: 1680 , height: 1050})
        const todayDate = new Date()
        const pdfn = await page.pdf({
            path: `${path.join(__dirname,'../public/files', todayDate.getTime()+".pdf")}`,
            format: "A4"
        })

        await browser.close()
    
        const pdfUrl = path.join(__dirname,'../public/files', todayDate.getTime()+".pdf")

        res.set({
            "Content-Type":"application/pdf",
            "Content-Length":pdfn.length
        })
        res.sendFile(pdfUrl)
        
    } catch (error) {
        res.render("admin/500")
        console.log(error);
    }
}
const htmltopdf=async(req,res)=>{
    try {
        const orderData = await order.find({ status: { $ne: "canceled" } }).sort({ date: -1 })
        res.render("admin/htmltopdf", { orders:orderData })

        
    } catch (error) {
        res.render("admin/500")
        console.log(error);
    }
}
module.exports = {
    login,
    postlogin,
    home,
    viewusers,
    blockuser,
    unblockuser,
    logout,
    orders,
    orderdetails,
    updatestatus,
    excelorder,
    salesreport,
    // pdforder
    pdforder,
    htmltopdf





}
