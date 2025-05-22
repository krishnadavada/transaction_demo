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
  }
}, { timestamps: true });

const passbook = mongoose.model('Passbooks', passbookSchema);
module.exports = passbook;
