const mongoose = require('mongoose');

const bonusSchema = new mongoose.Schema({
  iUserId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  nAmount: {
    type:Number,
    required:true
  },
  dGetAt: { type: Date, default: Date.now }
});

const bonus=mongoose.model('Bonus', bonusSchema);
module.exports = bonus;
