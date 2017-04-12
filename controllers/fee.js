var express = require("express");
var router = express.Router();
var Fee = require("../models/fee");

module.exports = function(passport) {
  /* Handle fee GET */
  router.get("/", function(req, res) {
      if (!req.isAuthenticated()) {
        res.redirect("/login");
      } else {
        Fee.find({}, handleFeeView.bind(null, req, res));
      }
  });
    
  /* Handle fee POST */
  router.post("/", function(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    var id = req.body.id;
    console.log("id = " + id);
    var price = req.body.price;
    Fee.update({ _id: id }, { $set: { price: price }}, function(err, doc) {
      req.flash("message", "Fee Redefined");
      return res.redirect("/fee");
    });
  });
  return router;
};

function handleFeeView(req, res, err, fee) {
    var resContent = { user: req.user, authenticated: req.isAuthenticated(), fee: fee };
    resContent.message = req.flash("message");
    res.render("fee", resContent);
}
