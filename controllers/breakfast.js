var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var moment = require('moment');

module.exports = function(passport) {
  /* Handle breakfast GET */
  router.get('/', function(req, res) {
      if (!req.isAuthenticated()) {
        res.redirect('/login');
      } else {
        Event.find({'type': 'breakfast'}, handleBreakFastView.bind(null, req, res));
      }
  });
    
  /* Handle breakfast POST */
  router.post('/', function(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
    if (!isTimeInputValid(req.body)) {
      req.flash('message', 'Invalid Time');
      return res.redirect('/breakfast');
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
      req.flash('message', 'Breakfast Redefined');
      return res.redirect('/breakfast');
    });
  });
  
  return router;
};

function isTimeInputValid(body) {
  var exp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g;
  return body.startTime.match(exp) && body.endTime.match(exp)
}

function handleBreakFastView(req, res, err, breakfast) {
    breakfast = breakfast[0];
    var startTime = moment(breakfast.startTime).format('HH:mm');
    var endTime = moment(breakfast.endTime).format('HH:mm');
    var resContent = { user: req.user, authenticated: req.isAuthenticated(), 
      breakfast: breakfast, startTime: startTime, endTime: endTime};
    resContent.message = req.flash('message');
    res.render('breakfast', resContent);
}
