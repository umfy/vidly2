const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
   },
   email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 100,
   },
   password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 100,
   },
   isAdmin: Boolean,
})

userSchema.methods.generateAuthToken = function () {
   const token = jwt.sign(
      { _id: this._id, isAdmin: this.isAdmin },
      config.get('jwtPrivateKey')
   )
   //  const token = jwt.sign({ _id: this._id }, '12345')
   return token
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
   const schema = Joi.object({
      name: Joi.string().min(2).max(50).required(),
      email: Joi.string().min(5).max(100).required().email(),
      password: Joi.string().min(4).max(50).required(),
   })
   return schema.validate(user)
}

module.exports.User = User
module.exports.validate = validateUser
