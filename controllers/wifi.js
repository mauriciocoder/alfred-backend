var express = require("express");
var router = express.Router();
var Wifi = require("../models/wifi");

module.exports = function(passport) {
  /* Handle wifi GET */
  router.get("/", function(req, res) {
      if (!req.isAuthenticated()) {
        res.redirect("/login");
      } else {
        Wifi.find({}, handleWifiView.bind(null, req, res));
      }
  });
    
  /* Handle wifi POST */
  router.post("/", function(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    var id = req.body.id;
    console.log("id = " + id);
    var login = req.body.login;
    var password = req.body.password;
    Wifi.update({ _id: id }, { $set: { login: login, password: password }}, function(err, doc) {
      req.flash("message", "Wifi Redefined");
      return res.redirect("/wifi");
    });
  });
  return router;
};

function handleWifiView(req, res, err, wifi) {
    console.log("wifi = " + JSON.stringify(wifi));
    var resContent = { user: req.user, authenticated: req.isAuthenticated(), wifi: wifi };
    resContent.message = req.flash("message");
    res.render("wifi", resContent);
}
