const mongoose = require('mongoose');

const SchemaType = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
  firstname : {
    type: String,
    required: true
  },
  lastname : {
    type: String,
    required: true
  },
  friends : [{
    type: SchemaType.ObjectId,
    ref: 'User'
  }],
});

module.exports = mongoose.model('User', userSchema);