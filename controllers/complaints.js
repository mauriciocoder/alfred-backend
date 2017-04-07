// TODO: Refactor same as order.js!!!!
var express = require("express");
var router = express.Router();
var Complaint = require("../models/complaint");

module.exports = function() {
    /* Handle orders GET */
    router.get("/", function(req, res) {
        console.log("chegou no complaints");
        if (!req.isAuthenticated()) {
          res.redirect("/login");
        } else {
          Complaint.find({}, handleComplaintsView.bind(null, req, res));
        }
    });
    /* Handle orders GET */
    router.get("/api", function(req, res) {
        console.log("chegou no complaints api");
        if (!req.isAuthenticated()) {
          console.log("not authenticated");
        } else {
          Complaint.find({}, function(err, complaints) {
            complaints = formatTimeStamp(complaints);
            res.json(complaints);
          });
        }
    });
    return router;
};

function handleComplaintsView(req, res, err, complaints) {
  complaints = formatTimeStamp(complaints);
  var resContent = { user: req.user, authenticated: req.isAuthenticated(), complaints: complaints };
  resContent.message = req.flash("message");
  res.render("complaints", resContent);
}

function formatTimeStamp(complaints) {
  return complaints.map(function(complaint) {
     complaint.timestamp = complaint.timestamp.replace(/T/, ' ').replace(/\..+/, '');
     return complaint;
  });
}
