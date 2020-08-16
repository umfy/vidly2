const express = require('express')
const mongoose = require('mongoose')
const { Movie } = require('../models/movie')
const { Rental, validate } = require('../models/rental')
const { Customer } = require('../models/customer')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
   const rentals = await Rental.find().sort('-dateOut')
   res.send(rentals)
})

router.post('/', auth, async (req, res) => {
   const validation = validate(req.body)
   if (validation.error)
      return res.status(400).send(validation.error.details[0].message)

   const movie = await Movie.findById(req.body.movieId)
   if (!movie) return res.status(404).send("There's no movie of given Id")

   const customer = await Customer.findById(req.body.customerId)
   if (!customer) return res.status(404).send("There's no Customer of given Id")

   if (movie.numberInStock === 0)
      return res.status(400).send('not enough movies')
   let rental = new Rental({
      customer: {
         _id: customer._id,
         name: customer.name,
         phone: customer.phone,
      },
      movie: {
         _id: movie._id,
         dailyRentalRate: movie.dailyRentalRate,
         title: movie.title,
      },
   })

   await rental.save()
   movie.numberInStock--
   movie.save()
   res.send(rental)
})

module.exports = router
