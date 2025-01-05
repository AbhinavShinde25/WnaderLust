const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js")

const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, result.error);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(listingController.index));

//new route

router.get("/new", isLoggedIn, listingController.newFormListing);

//show route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);
// create route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  
  wrapAsync(listingController.createListing)
);

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.editListing)
);

// update route
router.put(
  "/:id",
 
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// delete route

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
