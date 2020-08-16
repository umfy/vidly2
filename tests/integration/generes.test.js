const request = require('supertest')
const { Genere } = require('../../models/genere')
let server

describe('/api/generes', () => {
   beforeEach(() => {
      server = require('../../index4')
   })
   afterEach(async () => {
      server.close()
      // always cleanup after
      await Genere.remove({})
   })
   describe('GET /', () => {
      it('should return all generes', async () => {
         await Genere.collection.insertMany([
            { name: 'genere1' },
            { name: 'genere2' },
         ])
         // request is from supertest
         const res = await request(server).get('/api/generes')
         expect(res.status).toBe(200)
         expect(res.body.length).toBe(2)
         expect(res.body.some((g) => g.name === 'genere1')).toBeTruthy()
         expect(res.body.some((g) => g.name === 'genere2')).toBeTruthy()
      })
   })

   describe('GET /:id', () => {
      it('should return genere of given id', async () => {
         const genere = new Genere({ name: 'genere1' })
         await genere.save()

         const res = await request(server).get(`/api/generes/${genere._id}`)
         expect(res.status).toBe(200)
         expect(res.body).toHaveProperty('name', genere.name)
      })
      it('should return 404 if invalid id is passed', async () => {
         const res = await request(server).get('/api/generes/1')
         expect(res.body).toBe(404)
      })
   })
})
