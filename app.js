const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const cookiparser = require("cookie-parser");
const morgon = require("morgan");
const dotenv = require("dotenv");
const dbconnect = require("./config/connection");

dotenv.config();
dbconnect.dbconnect();

app.set("views");
app.set("view engine", "ejs");
app.set(cookiparser());
app.use(express.static(path.join(__dirname, "public")));

//morgon setup
app.use(morgon("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//session management
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    cookie: { maxAge: 6000000 },
    resave: false,
  })
);

//remove cache
app.use((req, res, next) => {
  res.header("Cache-Control", "no-cache,  no-store, must-revalidate");
  next();
});
app.use("/admin", adminRouter);
app.use("/", userRouter);

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(process.env.PORT, () => {
  console.log("Server started listening ato port");
});
