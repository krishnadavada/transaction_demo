const user=require('../models/authModel')
const bonus=require('../models/bonusModel')
const passbook=require('../models/passBookModel')
const {oStatus,oMessage,createResponse}=require('../helper/response')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

async function login(req,res){
    const { sEmail, sPassword } = req.body;
  try {
    const oUser = await user.findOne({ sEmail:sEmail });
    if (!oUser) return createResponse(res, oStatus.BadRequest, oMessage.invalid,'credentials');
 
    const bIsMatch = await bcrypt.compare(sPassword, oUser.sPassword);
    if (!bIsMatch) return createResponse(res, oStatus.BadRequest, oMessage.invalid,'credentials');

    const token = jwt.sign({ iId: oUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 86400000), //1 day
      })
      .status(200)
      .json({ message: "logged in successfully ! " });

  } 
  catch(err){
    console.log(err);
    return createResponse( res, oStatus.InternalServerError, oMessage.internal_err );
   }

}

async function register(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sName, sEmail, sPassword } = req.body;

    const existingUser = await user.findOne({ sEmail });

    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return createResponse(res, oStatus.BadRequest, oMessage.user_exist);
    }

    const sHashedPassword = await bcrypt.hash(sPassword, 10);

    const createdUsers = await user.create(
      [{ sName, sEmail, sPassword: sHashedPassword }],
      { session }
    );

    const oUser = createdUsers[0]; 
    
    await bonus.create(
      [{
        iUserId: oUser._id,
        nAmount: 100
      }],
      { session }
    );

    await passbook.create(
      [{
        iUserId: oUser._id,
        eTransactionType: 'CREDIT',
        nAmount: 100
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const token = jwt.sign(
      { iId: oUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 86400000), // 1 day
      })
      .status(200)
      .json({ message: "Register successfully with bonus!" });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return createResponse(res, oStatus.InternalServerError, oMessage.internal_err);
  }
}
 
module.exports={login,register}