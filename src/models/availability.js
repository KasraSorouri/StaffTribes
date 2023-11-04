const mongoose = require('mongoose');
const SchemaType = mongoose.Schema.Types;

const availability = new mongoose.Schema({
  weekNo : {
    type: Number,
    required: true
  },
  user : {
    type: SchemaType.ObjectId,
    ref: 'User',
    required: true
  },
  availabeDays : {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model('Availability', availability);
