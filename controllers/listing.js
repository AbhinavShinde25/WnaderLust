const listing =require("../models/listing")


module.exports.index = async (req, res) => {
    const listings = await listing.find({});
    // console.log(listings);

    res.render("./listing/index.ejs", { listings });
  }

module.exports.newFormListing = (req, res) => {
    res.render("./listing/new.ejs");
  }

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing
      .findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!Listing) {
      req.flash("error", "Listing you requested is not found");
      res.redirect("/listings");
    }
    // console.log(Listing);
    res.render("./listing/show.ejs", { listing: Listing });
  }


module.exports.createListing = async (req, res, next) => {

  let url = req.file.path;
  let filename = req.file.filename;

    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url ,filename};
    // console.log(listing);
    await newListing.save();
    req.flash("success", "New Listing is created");
    res.redirect("/listings");
  }

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if (!Listing) {
      req.flash("error", "Listing you requested is not found");
      res.redirect("/listings");
    }

    res.render("./listing/edit.ejs", { Listing });
  }

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
      throw expressError(400, "enter valid information ");
    }


    let { id } = req.params;
    let editListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if( typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      editListing.image = {url ,filename};
      await editListing.save();
  }
    // console.log("added");
    req.flash("success", "New Listing is updated!");

    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing = async (req, res) => {
      let { id } = req.params;
      await listing.findByIdAndDelete(id);
      req.flash("success", " Listing is deleted");
  
      res.redirect("/listings");
    }