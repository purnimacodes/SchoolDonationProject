const login = async (req, res) => {
  try {
    const { email , password} = req.body;

    const user = await user.findOne({email});

    if(!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.isPasswordCorrect
    );

    if(!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });

    }

    const accessToken = JsonWebTokenError.sign(
      {
        userId: user._id,


    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  res.json({
    message: "Login successful",
    accessToken,
  });
  } catch(error) {
    res.status(500).json({
      message:"Server error",
    });
  }
};

module.exports = {register, login};