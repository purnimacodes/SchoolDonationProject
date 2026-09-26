const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try{
    const {name, email, password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser) {
      return res.status(400).json({
        message: "User alredy exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

     const user = await User.create({
      name,
      email,
      password: hashedPassword,
     });

     res.status(201).json({
      message:"Registration successful",
      user:{
        id: user._id,
        name: user.name,
        email:user.email,
      },
     });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { register}