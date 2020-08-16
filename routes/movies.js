const express = require('express')
const mongoose = require('mongoose')
const { Movie, validate } = require('../models/movie')
const { Genere } = require('../models/genere')
const auth = require('../middleware/auth')
const router = express.Router()
//mongoose.set('useFindAndModify', false)

router.get('/', async (req, res) => {
   const movies = await Movie.find().sort('name')
   res.send(movies)
})

router.post('/', auth, async (req, res) => {
   const validation = validate(req.body)
   if (validation.error) return res.status(400).send(validation.error)

   const genere = await Genere.findById(req.body.genereId)
   if (!genere) return res.status(404).send("There's no genere of given Id")

   const movie = new Movie({
      title: req.body['title'],
      genere: {
         _id: genere['_id'],
         name: genere['name'],
      },

      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
   })
   await movie.save()
   res.send(movie)
})

router.put('/:id', auth, async (req, res) => {
   const validation = validate(req.body)
   if (validation.error) return res.status(400).send(validation.error)

   const genere = await Genere.findById(req.body.genereId)
   if (!genere) return res.status(404).send("There's no genere of given Id")

   const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
         title: req.body['title'],
         genere: {
            _id: genere['_id'],
            name: genere['name'],
         },
         numberInStock: req.body['numberInStock'],
         dailyRentalRate: req.body['dailyRentalRate'],
      },
      { new: true }
   )
   if (!movie) return res.status(404).send("The movie doesn't exist")
   res.send('Zaktualizowano')
})

router.get('/:id', async (req, res) => {
   const movie = await Movie.findById(req.params.id)
   if (!movie) return res.status(404).send('The customer doesnt exist')
   res.send(movie)
})

module.exports = router
