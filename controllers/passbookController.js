const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const user = require('../models/authModel');
const passbook = require('../models/passBookModel');
const { oStatus, oMessage, createResponse } = require('../helper/response');

async function amountTransfer(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { to, amount } = req.body;
    const token = req.cookies.token;

    if (!token) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const fromUserId = decoded.iId || decoded.id;

    const fromUser = await user.findById(fromUserId).session(session);
    console.log(fromUser)
    if (!fromUser ) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "User not found" });
    }

    const transactions = await passbook.findOne({iUserId:fromUserId});

    console.log(transactions)
    if (amount > transactions.nAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Insufficient balance" });
    }

    await passbook.create([
      {
        iUserId: fromUserId,
        iToUserId: to,
        eTransactionType: 'DEBIT',
        nAmount: amount
      },
      {
        iUserId: to,
        iToUserId: fromUserId,
        eTransactionType: 'CREDIT',
        nAmount: amount
      }
    ], { session ,ordered:true});

    await session.commitTransaction();
    session.endSession();

    console.log("Transfer successful");
    return res.status(200).json({ message: "Transfer successful", remainingBalance: transactions.nAmount - amount });

  } catch (err) {
    console.error("Transfer error:", err);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports =  amountTransfer ;
