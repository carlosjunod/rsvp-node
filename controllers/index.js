var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");

const GuestGroupList = require('../models/Guest')

/* GET home page. */
router.get('/rsvp', function(req, res, next) {
  
  GuestGroupList.find((err, groups)=>{
    if (err) res.render('index', { title: 'Añadir a la lista' });
  
    res.render('index', { title: 'Añadir a la lista', groups})
  })
});

router.post('/add', (req,res,next)=>{

  let obj = req.body
  obj.code = randomstring.generate(7)
  
  var newGroup = new GuestGroupList({ ...obj })

  newGroup.save(function (err, group) {
    if (err) return console.error(err)
    console.log('group', group)
  })

  res.sendStatus(200)
})

module.exports = router;
