import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema= new mongoose.Schema(
    {
   email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
   } ,
   role:{
    type:String,
    required:true,
    enum:["admin","verifier","donar"],
    default:"donar",
   },
   name:{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
   },
   password:{
    type:String,
    required:[true,"password is required"]
   },
   refreshToken:{
    type:String
   }
}
,{timestamps:true}) //update created and updatedAt

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect= async function (password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id:this.id,
        email:this.email,
        role:this.role,
        name:this.name 
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

//refreshtoken db me bhi save hota h to hm compare kr lete h login krte time kbhi kbhi
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id:this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userSchema)