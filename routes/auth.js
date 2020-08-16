const _ = require('lodash')
const bcrypt = require('bcrypt')
//const jwt = require('jsonwebtoken')
//const config = require('config')
const express = require('express')
const mongoose = require('mongoose')
const { User } = require('../models/user')
const Joi = require('joi')
const router = express.Router()
//mongoose.set('useFindAndModify', false)

router.post('/', async (req, res) => {
   const validation = validate(req.body)
   if (validation.error)
      return res.status(400).send(validation.error.details[0].message)

   let user = await User.findOne({ email: req.body.email })
   if (!user) return res.status(400).send('Invalid Email or password')

   const validPassword = await bcrypt.compare(req.body.password, user.password)
   if (!validPassword) return res.status(400).send('Invalid email or Password')

   const token = user.generateAuthToken()
   res.send(token)
})

function validate(req) {
   const schema = Joi.object({
      email: Joi.string().min(5).max(100).required().email(),
      password: Joi.string().min(4).max(50).required(),
   })
   return schema.validate(req)
}

module.exports = router
