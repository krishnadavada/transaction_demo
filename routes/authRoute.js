const express = require('express')
const router=express.Router()
const {register,login}=require('../controllers/authController')
const {aLoginData,aRegisterData, validateReq } = require('../middlewares/validate')

router.post('/login',[aLoginData,validateReq],(req,res)=>{
    login(req,res)
})

router.post('/register',[aRegisterData,validateReq],(req,res)=>{
    register(req,res)
})

module.exports=router