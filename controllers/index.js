var express = require('express');
var router = express.Router();

const GuestGroupList = require('../models/Guest')

/* GET home page. */
router.get('/rsvp', function(req, res, next) {


  res.render('index', { title: 'Enviar Invitacion' });
  

});

router.post('/rsvp/:group', (req,res,next)=>{
  var newGroup = new GuestGroupList({ name: 'my Group :D' })
  newGroup.save(function (err, fluffy) {
    if (err) return console.error(err)
  })

})

module.exports = router;
