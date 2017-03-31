var express = require("express");
var router = express.Router();
var Order = require("../models/order");

module.exports = function() {
    /* Handle orders GET */
    router.get("/", function(req, res) {
        console.log("chegou no orders");
        if (!req.isAuthenticated()) {
          res.redirect("/login");
        } else {
          Order.find({}, handleOrdersView.bind(null, req, res));
        }
    });
    /* Handle orders GET */
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
    return router;
};

function handleOrdersView(req, res, err, orders) {
    orders = formatTimeStamp(orders);
    var resContent = { user: req.user, authenticated: req.isAuthenticated(), orders: orders };
    resContent.message = req.flash("message");
    res.render("orders", resContent);
}

function formatTimeStamp(orders) {
    return orders.map(function(order) {
       order.timestamp = order.timestamp.replace(/T/, ' ').replace(/\..+/, '');
       return order;
    });
}
