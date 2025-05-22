const mongoose = require('mongoose');
const { aTransectionType } = require('../utils/enum');

const passbookSchema = new mongoose.Schema({
  iUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  iToUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  eTransactionType: {
    type: String,
    enum: aTransectionType,
    required: true
  },
  nAmount: {
    type: Number,
    required: true
  },
  nTotalAmount: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

const passbook = mongoose.model('Passbook', passbookSchema); // Use singular form
module.exports = passbook;
