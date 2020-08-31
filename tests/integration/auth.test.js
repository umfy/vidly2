const request = require('supertest')
const { User } = require('../../models/user')
const { Genere } = require('../../models/genere')

describe('auth middleware', () => {
   beforeEach(() => {
      server = require('../../index4')
   })
   afterEach(async () => {
      await Genere.deleteMany({})
      server.close()
   })

   //MOSH' TECHNIQUE
   let token
   // await w wywołaniu funkcji pownien wystarczyć
   const exec = () => {
      return request(server)
         .post('/api/generes')
         .set('x-auth-token', token)
         .send({ name: 'genere1' })
   }
   beforeEach(() => {
      token = new User().generateAuthToken()
   })

   it('should return 401 if no token is provided', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
   })
   it('should return 400 if token is invalid', async () => {
      token = 'a'
      const res = await exec()
      expect(res.status).toBe(400)
   })
   it('should return 200 if token is valid', async () => {
      const res = await exec()
      expect(res.status).toBe(200)
   })
})
