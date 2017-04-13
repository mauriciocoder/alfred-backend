var express = require("express");
var router = express.Router();
var Checkout = require("../models/checkout");

module.exports = function() {
    /* Handle checkout GET */
    router.get("/", function(req, res) {
        if (!req.isAuthenticated()) {
          res.redirect("/login");
        } else {
          Checkout.find({}, handleCheckoutView.bind(null, req, res));
        }
    });
    /* Handle orders GET */
    /*
    router.get("/api", function(req, res) {
        console.log("chegou no orders api");
        if (!req.isAuthenticated()) {
          console.log("not authenticated");
        } else {
          Order.find({}, function(err, orders) {
            orders = formatTimeStamp(orders);
            res.json(orders);
          });
        }
    });
    */
    return router;
};

function handleCheckoutView(req, res, err, checkouts) {
    checkouts = format(checkouts);
    var resContent = { user: req.user, authenticated: req.isAuthenticated(), checkouts: checkouts };
    resContent.message = req.flash("message");
    res.render("checkouts", resContent);
}

function format(checkouts) {
    return checkouts.map(function(checkout) {
       checkout.timestamp = checkout.timestamp.replace(/T/, ' ').replace(/\..+/, '');
       checkout.totalFee = checkout.totalStayFee + checkout.totalOrdersFee;
       return checkout;
    });
}
