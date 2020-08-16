const config = require('config')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const express = require('express')
const mongoose = require('mongoose')
const { User, validate } = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()
//mongoose.set('useFindAndModify', false)

router.get('/me', auth, async (req, res) => {
   // req.user._id comes with json web token
   const user = await User.findById(req.user._id).select('-password')
   res.send(user)
})

router.post('/', async (req, res) => {
   const validation = validate(req.body)
   if (validation.error)
      return res.status(400).send(validation.error.details[0].message)

   let user = await User.findOne({ email: req.body.email })
   if (user) return res.status(400).send('user already registered')

   user = new User(_.pick(req.body, ['name', 'email', 'password']))
   const salt = await bcrypt.genSalt(10)
   user.password = await bcrypt.hash(user.password, salt)
   await user.save()

   const token = user.generateAuthToken()

   res.header('x-auth-token', token).send(
      _.pick(user, ['_id', 'name', 'email'])
   )
})

module.exports = router
