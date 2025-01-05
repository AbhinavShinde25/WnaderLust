const User = require("../models/user");

module.exports.renderSignUpForm =  (req, res) => {
    res.render("users/signUp.ejs");
  }

  module.exports.signUp = async (req, res) => {
      try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser , (err) =>{
          if(err){
            next(err);
          }
          req.flash("success", "welcome on wanderlust! ");
          res.redirect("/listings");
  
        })
        
      } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signUp");
      }
    }

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.logIn = async (req, res) => {
    req.flash("success" , "welcome back to wanderlust ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

module.exports.logOut =  (req ,res ,next) =>{
    req.logout((err) =>{
      if(err){
        return next(err);
      }
      req.flash("success", "you logout succesfully");
      res.redirect("/listings");
    })
  }