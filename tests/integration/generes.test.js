const request = require('supertest')
const { Genere } = require('../../models/genere')
const { User } = require('../../models/user')
const mongoose = require('mongoose')
let server

describe('/api/generes', () => {
   beforeEach(() => {
      server = require('../../index4')
   })
   afterEach(async () => {
      // always cleanup after
      await Genere.deleteMany({})
      await server.close()
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
         expect(res.status).toBe(404)
      })
   })
   describe('POST /', () => {
      // Define the happy path, and then in each test, we change
      // one parameter that clearly aligns with the name of the
      // test.
      let token
      let name

      const exec = async () => {
         return await request(server)
            .post('/api/generes')
            .set('x-auth-token', token)
            .send({ name: name })
      }

      beforeEach(() => {
         token = new User().generateAuthToken()
         name = 'genere1'
      })

      it('should return 401 if client is not logged in', async () => {
         token = ''
         const res = await exec()
         expect(res.status).toBe(401)
      })

      it('should return 400 if genere is less than 5 characters', async () => {
         name = '1234'
         const res = await exec()
         expect(res.status).toBe(400)
      })

      it('should return 400 if genere is more than 50 characters', async () => {
         name = new Array(52).join('a')

         const res = await exec()

         expect(res.status).toBe(400)
      })

      it('should save the genere if it is valid', async () => {
         await exec()
         const genere = await Genere.find({ name: 'genere1' })
         expect(genere).not.toBeNull()
      })

      it('should return the genere if it is valid', async () => {
         res = await exec()
         expect(res.body).toHaveProperty('_id')
         expect(res.body).toHaveProperty('name', 'genere1')
      })
   })
   describe('PUT /:id', () =>{
      let token
      let newName
      let genere
      let id

      const exec = async () => {
         return await request(server)
            .put('/api/generes/' + id)
            .set('x-auth-token', token)
            .send({ name: newName })
      }

      beforeEach( async () => {
         genere = new Genere({ name: 'genere1' })
         await genere.save()
         id = genere._id
         newName = 'newGenere'
         token = new User().generateAuthToken()
      })
      it('should return 401 if user is not logged in', async () =>{
         // console.log('THIS IS ID: ', id)
         token = ''
         const res = await exec()
         expect(res.status).toBe(401)   
      })
      it('should return 400 if genere name is < 5 char', async () =>{
         newName='1234'
         const res = await exec()
         expect(res.status).toBe(400)   
      })
      it('should return 400 if genere name is > 50', async () => {
         newName = Array(52).join('a')
         const res = await exec()
         expect(res.status).toBe(400)   
      })
      it('should return 404 if id is invalid', async () =>{
         id = 1
         const res = await exec()
         expect(res.status).toBe(404)   
      })
      it('should return 404 if genere with the given id was not found', async () => {
         id = mongoose.Types.ObjectId();
   
         const res = await exec();
   
         expect(res.status).toBe(404);
       });
   
       it('should update the genere if input is valid', async () => {
         await exec();
         const updatedgenere = await Genere.findById(genere._id);
         expect(updatedgenere.name).toBe(newName);
       });
   
       it('should return the updated genere if it is valid', async () => {
         const res = await exec();
   
         expect(res.body).toHaveProperty('_id');
         expect(res.body).toHaveProperty('name', newName);
       });
     });  
   
     describe('DELETE /:id', () => {
       let token; 
       let genere; 
       let id; 
   
       const exec = async () => {
         return await request(server)
           .delete('/api/generes/' + id)
           .set('x-auth-token', token)
           .send();
       }
   
       beforeEach(async () => {
         // Before each test we need to create a genere and 
         // put it in the database.      
         genere = new Genere({ name: 'genere1' });
         await genere.save();
         
         id = genere._id; 
         token = new User({ isAdmin: true }).generateAuthToken();     
       })
   
       it('should return 401 if client is not logged in', async () => {
         token = ''; 
   
         const res = await exec();
   
         expect(res.status).toBe(401);
       });
   
       it('should return 403 if the user is not an admin', async () => {
         token = new User({ isAdmin: false }).generateAuthToken(); 
   
         const res = await exec();
   
         expect(res.status).toBe(403);
       });
   
       it('should return 404 if id is invalid', async () => {
         id = 1; 
         
         const res = await exec();
   
         expect(res.status).toBe(404);
       });
   
       it('should return 404 if no genere with the given id was found', async () => {
         id = mongoose.Types.ObjectId();
   
         const res = await exec();
   
         expect(res.status).toBe(404);
       });
   
       it('should delete the genere if input is valid', async () => {
         await exec();
         const genereInDb = await Genere.findById(id);
         expect(genereInDb).toBeNull();
       });
   
       it('should return the removed genere', async () => {
         const res = await exec();
   
         expect(res.body).toHaveProperty('_id', genere._id.toHexString());
         expect(res.body).toHaveProperty('name', genere.name);
       });
     });  
   });