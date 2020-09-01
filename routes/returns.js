const express = require('express')
const mongoose = require('mongoose')
const { Customer } = require('../models/customer')
const { Rental } = require('../models/rental')
const { Movie } = require('../models/movie')
const auth = require('../middleware/auth')
const Joi = require('joi')
const router = express.Router()
const validate = require('../middleware/validate')

router.post('/',[auth, validate(validateReturn)], async (req, res) => {
    // if (!req.body.customerId) return res.status(400).send('CustomerId not provided')
    // if (!req.body.movieId) return res.status(400).send('movieId not provided')
   
    //  const validation = validateReturn(req.body)
    //  if (validation.error) return res.status(400).send(validation.error)
  
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)
    
    
    if(!rental) return res.status(404).send('Rental does not exist')
    
    if (rental.dateReturned) return res.status(400).send('Rental already processed')
    
    rental.setRentalFee()

    await Movie.update({_id: rental.movie._id }, {
        $inc: {numberInStock: 1}
    })


    await rental.save()
    // res.status(200).send(rental)
    res.send(rental)
})

function validateReturn(req) {
    const schema = Joi.object({
       customerId: Joi.objectId().required(),
       movieId: Joi.objectId().required(),
    })
    return schema.validate(req)
 }

module.exports = router