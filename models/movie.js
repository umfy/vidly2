const mongoose = require('mongoose')
const Joi = require('joi')
const { genereSchema } = require('./genere')

const movieSchema = new mongoose.Schema({
   title: {
      type: String,
      trim: true,
      required: true,
      minlength: 1,
      maxlength: 255,
   },
   genere: {
      type: genereSchema,
      required: true,
   },
   numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
   },
   dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
   },
})

function validateMovie(genere) {
   const schema = Joi.object({
      title: Joi.string().min(1).max(50).required(),
      genereId: Joi.objectId(),
      numberInStock: Joi.number().min(0).required(),
      dailyRentalRate: Joi.number().min(0).required(),
   })
   return schema.validate(genere)
}

const Movie = mongoose.model('Movie', movieSchema)

module.exports.Movie = Movie
module.exports.validate = validateMovie
