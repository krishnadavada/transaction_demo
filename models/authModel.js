const {Schema,model}=require('mongoose')

const oUserSchema=new Schema({
    sName:{
        type:String,
        trim:true,
        required:true
    },
    sEmail:{
        type:String,
        trim:true,
        unique:true,
        required:true
    },
      sPassword:{
     type:String,
     required:true
  }
},{timestamps:true})

const user=model('Users',oUserSchema)

module.exports=user