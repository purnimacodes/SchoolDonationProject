
import { exist } from "joi";
import { User } from "../Models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens= async (userId)=>{
 try {
  const user =await User.findById(userId)

  
  const accessToken= user.generateAccessToken()
  

  
  const refreshToken =user.generateRefreshToken()
    
 
  user.refreshToken=refreshToken;

  //validation kuchh mat lgao sidha lakr save kr do enail password kuchh nhi chahiye
  await user.save({validateBeforeSave:false});
 
  return {refreshToken, accessToken}
 } catch (error) {
  throw new apiError(500,"something goes wrong while generating access and refresh tokens")
 }
}
const registerUser = async (req, res) => {
  try {
    const { name, email, password,role="csc" } = req.body;

    if (!name || !email || !password) {
      throw new apiError(400,"All field are require");
    };
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      throw new apiError(409,"User already exist");
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

     const createdUser= await User.findById(user._id).select(
      "-password "
     );

     if(!createdUser){
      throw new apiError(400,"Something went wrong while creating user")
     }

    return res.status(200).json(
      new apiResponse(200,createdUser,"User created successfully"))

  } catch (err) {
    console.log('Error occurred while creating user:', err);
    res.status(500).json(
      new apiError(500,"Internal server error"))
  }
}

const loginUser= async(req,res)=>{
  try {
    const {email,password}=req.body;
    if (!email || !password) {
      throw new apiError(400,"All field are require");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new apiError(401,"User not found");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new apiError(401,"Invalid password");
    };
    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id);

    const options= {
      httpOnly:true,
      secure:true
    };

    return res.status(200).json(
      new apiResponse(200,{
        accessToken,
        refreshToken
      },"Login successful"))
    
  } catch (err) {
    console.log('Error occurred while logging in:', err);
    res.status(500).json(
      new apiError(500,"Internal server error"))
    
  }
}

const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      },
     
    },{
      new:true
    }

  )

  const options={
    httpOnly: true,
    secure:true
   }

   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new apiResponse(200,{},"user logged out"))
})

const getCurrentUser= asyncHandler( async (req,res)=>{
  return res
  .status(200)
  .json(new apiResponse(200,
    req.user,
    "current user fetched"
  ))
})
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
}