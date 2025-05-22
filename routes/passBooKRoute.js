const express = require('express')
const router=express.Router()
const {atransferData,validateReq } = require('../middlewares/validate')
const  amountTransfer  = require('../controllers/passbookController')

router.post('/transfer',[atransferData,validateReq],amountTransfer)


module.exports=router
