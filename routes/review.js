const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuther } = require("../middleware.js");
const reviewController = require("../controllers/review.js")

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, result.error);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedIn ,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// delete review

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuther,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
