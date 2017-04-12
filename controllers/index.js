var express = require("express");
var router = express.Router();
module.exports = function(passport) {
  router.get("/", function(req, res) {
      if (!req.isAuthenticated()) {
        res.redirect("/login");
      } else {
        res.redirect("/orders");
      }
  });

  /* Handle Logout */
  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  router.use("/login", require("./login")(passport));
  router.use("/register", require("./register")(passport));
  router.use("/orders", require("./orders")());
  router.use("/complaints", require("./complaints")());
  router.use("/wifi", require("./wifi")());
  router.use("/breakfast", require("./breakfast")());
  router.use("/checkoutConfig", require("./checkoutConfig")());
  router.use("/fee", require("./fee")());
  return router;
}
