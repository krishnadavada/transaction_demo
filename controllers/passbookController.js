const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/authModel');
const Passbook = require('../models/passBookModel');
const {createResponse,oMessage,oStatus}=require('../helper/response')

async function amountTransfer(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { to, amount } = req.body;
    const sToken = req.cookies.token;

    if (!sToken) {
      await session.abortTransaction();
      session.endSession();
      return createResponse(res,oStatus.Unauthorized,oMessage.no_token);
    }

    const oDecoded = jwt.verify(sToken, process.env.JWT_SECRET);
    const iFromUserId = oDecoded.iId || oDecoded.id;

    const oFromUser = await User.findById(iFromUserId).session(session);
    if (!oFromUser) {
      await session.abortTransaction();
      session.endSession();
      return createResponse(res,oStatus.NotFound,oMessage.not_found,"Sender")
    }

    const oToUser = await User.findById(to).session(session);
    if (!oToUser) {
      await session.abortTransaction();
      session.endSession();
      return createResponse(res,oStatus.NotFound,oMessage.not_found,"Receiver")
    }

    // Get sender's transaction history
    const aSenderTx = await Passbook.find({ iUserId: iFromUserId });
    const nSenderBalance = aSenderTx.reduce((sum, tx) => {
      return sum + (tx.eTransactionType === 'CREDIT' ? tx.nAmount : -tx.nAmount);
    }, 0);

    if (amount > nSenderBalance) {
      await session.abortTransaction();
      session.endSession();
      return createResponse(res,oStatus.BadRequest,oMessage.insuf_amount)
    }

    const nSenderNewBalance = nSenderBalance - amount;
   
    // Get receiver's balance
    const aReceiverTx = await Passbook.find({ iUserId: to });
    const nReceiverBalance = aReceiverTx.reduce((sum, tx) => {
      return sum + (tx.eTransactionType === 'CREDIT' ? tx.nAmount : -tx.nAmount);
    }, 0);
    const nReceiverNewBalance = nReceiverBalance + amount;

    // Record DEBIT for sender
    await Passbook.create([{
      iUserId: iFromUserId,
      iToUserId: to,
      eTransactionType: 'DEBIT',
      nAmount: amount,
      nTotalAmount: nSenderNewBalance
    }], { session });

    // Record CREDIT for receiver
    await Passbook.create([{
      iUserId: to,
      iToUserId: iFromUserId,
      eTransactionType: 'CREDIT',
      nAmount: amount,
      nTotalAmount: nReceiverNewBalance
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Transfer successful",
      remainingBalance: nSenderNewBalance
    });

  } catch (err) {
    console.error("Transfer error:", err);
    await session.abortTransaction();
    session.endSession();
    return createResponse(res,oStatus.InternalServerError,oMessage.internal_err)
  }
}

module.exports = amountTransfer;
