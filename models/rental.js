const mongoose = require('mongoose')
const Joi = require('joi')
const rentalSchema = new mongoose.Schema({
   customer: {
      type: new mongoose.Schema({
         name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
         },
         isGold: {
            type: Boolean,
            default: false,
         },
         phone: {
            type: String,
            required: true,
            minlength: 9,
            maxlength: 13,
         },
      }),
      required: true,
      minlength: 1,
      maxlength: 255,
   },
   movie: {
      type: new mongoose.Schema({
         title: {
            type: String,
            trim: true,
            required: true,
            minlength: 1,
            maxlength: 255,
         },
         dailyRentalRate: {
            type: Number,
            required: true,
            min: 0,
            max: 255,
         },
      }),
      required: true,
      minlength: 1,
      maxlength: 255,
   },
   dateOut: {
      type: Date,
      required: true,
      default: Date.now,
   },
   dateReturned: {
      type: Date,
   },
   rentalFee: {
      type: Number,
      min: 0,
   },
})

function validateRental(rental) {
   const schema = Joi.object({
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required(),
   })
   return schema.validate(rental)
}

const Rental = mongoose.model('Rental', rentalSchema)

module.exports.Rental = Rental
module.exports.validate = validateRental
