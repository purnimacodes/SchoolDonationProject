const { default: bcrypt } = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    
    
  }

});


UserSchema.pre("save", async function (next){
  userSchena.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    this.password = await bcrypt.hash(this.password, 10)
    next()
  })
})

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel