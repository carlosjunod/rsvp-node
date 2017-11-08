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
  tracking: {
    sent: { type: Boolean, default: false },
    count: { type: Number, default: 0 }
  }
})

module.exports = mongoose.model('guestGroup', GuestGroupSchema);