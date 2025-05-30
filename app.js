
if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error" ,()=>{
  console.log("error in session" ,error);
  
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 724 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "public")));



main()
  .then(() => {
    console.log("connection succesful ");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/", (req, res) => {
//   res.send("working");
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user; 
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/demo", async (req, res) => {
  let fakeUser = new User({
    email: "xyz@email.com",
    username: "abc",
  });

  let registeredUser = await User.register(fakeUser, "123456");
  res.send(registeredUser);
});

// review route

// app.get("/listingTest" , async (req ,res) =>{
//     let sampleListing = new listing({
//         title:"home villa",
//         desription:"center of pimpri",
//         price:300000,
//         location:"pimpri pune",
//         country:"india"
//     });

//     await sampleListing.save();
//     console.log("added sucessfully");
//     res.send("testing working ")

// })

//  error defiining middleware

app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something is wrong " } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen("4040", () => {
  console.log("app is listen at port 4040");
});
