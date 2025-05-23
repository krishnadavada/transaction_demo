const express = require('express')
const router=express.Router()
const {register,login}=require('../controllers/authController')
const {aLoginData,aRegisterData, validateReq } = require('../middlewares/validate')

router.post('/login',[aLoginData,validateReq],login)

router.post('/register',[aRegisterData,validateReq],register)

module.exports=router