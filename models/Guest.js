var mongoose = require('mongoose');

const GuestGroupSchema = mongoose.Schema({
  groupName: String,
  size: Number,
  list: [{
    guesName: String,
    attend: Boolean
  }],
  lang: String,
  email: String,
  message: String,
  code: String,
  sended: false
})

module.exports = mongoose.model('guestGroup', GuestGroupSchema);