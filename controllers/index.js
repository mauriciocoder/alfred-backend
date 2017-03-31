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
    //router.use("/poll", require("./poll")());
    //router.use("/answer", require("./answer")());
    return router;
}
