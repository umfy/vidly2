const {Rental} = require('../../models/rental')
const {User} = require('../../models/user')
const mongoose = require('mongoose')
const request = require('supertest')
const moment = require('moment')
const { Movie } = require('../../models/movie')

describe('/api/returns/', () => {
    let server
    let customerId 
    let movieId
    let rental
    let token
    let movie

    const exec = async () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId: customerId, movieId: movieId})
        
    }
    
    beforeEach( async () => {
        server = require('../../index4')
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()
        token = new User().generateAuthToken()
        
        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2, 
            genere:  {name: '12345'},
            numberInStock: 10 
        })
        await movie.save()
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '123456789'
            },
            movie: {
                _id: movieId,
                title: '123',
                dailyRentalRate: 2
            }
        })   
        await rental.save()
     })
     afterEach(async () => {
        await server.close()
        await Rental.deleteMany({})
        await Movie.deleteMany({})
     })
   
     it('should return 401 if client is not logged in', async () => {
        token='' 
        const res = await exec()
        expect(res.status).toBe(401)
     })
     it('should return 400 if customerId is not provided', async () => {
        customerId=''
        const res = await exec()
        expect(res.status).toBe(400)
     })
     it('should return 400 if movieId is not provided', async () => {
        movieId='' 
        const res = await exec()
       expect(res.status).toBe(400)
    })
    it('should return 404 if no rental found for this customer/movie', async () => {
        await Rental.deleteMany({})
        const res = await exec()
       expect(res.status).toBe(404)
    })
    it('should return 400 if rental is already processed', async () => {
        rental.dateReturned = new Date()
        await rental.save()
        const res = await exec()
        expect(res.status).toBe(400)
    })
    it('should return 200 if valid request', async () => {
        const res = await exec()
        expect(res.status).toBe(200)
    })
    it('set the return date if input is valid', async () => {
        const res = await exec()
        const rentalInDb = await Rental.findById(rental._id)
        const diff = new Date() - rentalInDb.dateReturned
        //expect(rentalInDb.dateReturned).toBeDefined()
        expect(diff).toBeLessThan(10*1000)
    })
    it('should return the rental fee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate()
        await rental.save()

        const res = await exec()
        const rentalInDb = await Rental.findById(rental._id)
        expect(rentalInDb.rentalFee).toBe(14)
    })
    it('should increase the stack for the movie', async () => {
        const res = await exec()
        const movieInDb = await Movie.findById(movieId)
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)
    })
    it('should return the rental if everything is ok', async () => {
        const res = await exec()
        const rentalInDb = await Rental.findById(rental._id)
        //expect(res.body).toMatchObject(rentalInDb)
        // expect(res.body).toHaveProperty('dateOut')
        // expect(res.body).toHaveProperty('dateReturned')
        // expect(res.body).toHaveProperty('rentalFee') 
        // expect(res.body).toHaveProperty('customer')
        // expect(res.body).toHaveProperty('movie')

        // arrayContaining - everything 'expected' has to be in first ()
        const expected = expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
        expect(Object.keys(res.body)).toEqual(expected)

    })
})