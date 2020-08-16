const { User } = require('../../../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config = require('config')

describe('user.generateAuthToken', () => {
   it('should return valid JWToken', () => {
      const payload = {
         _id: new mongoose.Types.ObjectId().toHexString(),
         isAdmin: true,
      }
      const user = new User(payload)
      token = user.generateAuthToken()
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
      expect(decoded).toMatchObject(payload)
   })
})
