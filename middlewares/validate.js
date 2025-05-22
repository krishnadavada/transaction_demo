const { body,validationResult }=require("express-validator");
const mongoose=require('mongoose')

const aLoginData=[
    body('sEmail').notEmpty().withMessage('Email is required !').bail().isEmail().normalizeEmail().withMessage('Invalid data type of email !').bail(),
  
    body('sPassword').notEmpty().withMessage('Password is required !').bail().isString().trim().withMessage('Invalid data type of password !').bail()
]

aRegisterData=[
    body('sName').notEmpty().withMessage('Username is required !').bail().isString().trim().withMessage('Invalid data type of username !').bail(),
    body('sEmail').notEmpty().withMessage('Email is required !').bail().isEmail().normalizeEmail().withMessage('Invalid data type of email !').bail(),
    body('sPassword').notEmpty().withMessage('Password is required !').bail().isString().trim().withMessage('Invalid data type of password !').bail()
]

atransferData=[
      body('to').notEmpty().withMessage('id of reciever is required !').bail().isMongoId().withMessage('Invalid ObjectId'),
      body('amount').notEmpty().withMessage('amount is required !').bail().isNumeric().withMessage('amount must be a number').bail(),

]
function validateReq(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({massage : errors.array()});
    }
    next();
}

module.exports={aLoginData,aRegisterData,atransferData,validateReq}