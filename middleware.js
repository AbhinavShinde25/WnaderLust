// const { findById } = require("./models/user");
const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login for add new listing");
    return res.redirect("/login");
  }

  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.curruser._id)) {
    req.flash("error", "you don't permission to do this operation  ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuther = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.curruser._id)) {
    req.flash("error", "you don't delete other's review  ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
