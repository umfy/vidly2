const mongoose = require('mongoose')
const Joi = require('joi')

const genereSchema = new mongoose.Schema({
   name: { type: String, required: true, minlength: 2, maxlength: 50 },
})
const Genere = mongoose.model('Genere', genereSchema)

function validateGenere(genere) {
   const schema = Joi.object({
      name: Joi.string().min(3).required(),
   })
   return schema.validate(genere)
}

module.exports.Genere = Genere
module.exports.validate = validateGenere
module.exports.genereSchema = genereSchema
