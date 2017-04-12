var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var moment = require('moment');

module.exports = function(passport) {
  /* Handle checkout config GET */
  router.get('/', function(req, res) {
      if (!req.isAuthenticated()) {
        res.redirect('/login');
      } else {
        Event.find({'type': 'checkout'}, handleCheckoutView.bind(null, req, res));
      }
  });
    
  /* Handle checkout POST */
  router.post('/', function(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
    if (!isTimeInputValid(req.body)) {
      req.flash('message', 'Invalid Time');
      return res.redirect('/checkoutConfig');
    }
    var startTime = moment().utc();
    var startTimeHour = req.body.startTime.split(':')[0];
    var startTimeMinute = req.body.startTime.split(':')[1];
    startTime.set({hour: startTimeHour, minute: startTimeMinute});
    
    var endTime = moment().utc();
    var endTimeHour = req.body.endTime.split(':')[0];
    var endTimeMinute = req.body.endTime.split(':')[1];
    endTime.set({hour: endTimeHour, minute: endTimeMinute});

    Event.update({ _id: req.body.id }, { $set: { startTime: startTime, endTime: endTime }}, function(err, doc) {
      req.flash('message', 'Checkout Redefined');
      return res.redirect('/checkoutConfig');
    });
  });
  
  return router;
};

function isTimeInputValid(body) {
  var exp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g;
  return body.startTime.match(exp) && body.endTime.match(exp)
}

function handleCheckoutView(req, res, err, checkout) {
    checkout = checkout[0];
    var startTime = moment(checkout.startTime).format('HH:mm');
    var endTime = moment(checkout.endTime).format('HH:mm');
    var resContent = { user: req.user, authenticated: req.isAuthenticated(), 
      checkout: checkout, startTime: startTime, endTime: endTime};
    resContent.message = req.flash('message');
    res.render('checkoutConfig', resContent);
}
