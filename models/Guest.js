var mongoose = require('mongoose');

const GuestGroupSchema = mongoose.Schema({
  name: String,
  size: Number,
  list: {
    nameguest: String,
    attend: Boolean
  }
})

module.exports = mongoose.model('guestGroup', GuestGroupSchema);