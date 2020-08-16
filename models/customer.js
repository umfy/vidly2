const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model(
   'Customer',
   new mongoose.Schema({
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
   })
)

function validateCustomer(customer) {
   const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      phone: Joi.string().min(9).max(13).required(),
      isGold: Joi.boolean(),
   })
   return schema.validate(customer)
}

module.exports.Customer = Customer
module.exports.validate = validateCustomer
