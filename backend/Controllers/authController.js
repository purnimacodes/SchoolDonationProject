const UserModel = require('../Models/User')

const bcrypt = require('bcrypt');



const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400)
        .json({ message: 'All field are require' });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409)
        .json({ message: 'User is already exist , you can login', success: false });
    }
    const ceatedUser = await UserModel.create({
      name,
      email,
      password
    })

    return res.status(200).json({
      message: "Account is created successfully",
    })

  } catch (err) {
    res.status(500)
      .json({
        message: "Internal server error",
        success: false
      })
  }
}

module.exports = {
  signup
}