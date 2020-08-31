const validateObjectId = require('../middleware/validateObjectId')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const express = require('express')
const mongoose = require('mongoose')
const { Genere, validate } = require('../models/genere')
//const asyncMiddleware = require('../middleware/async')
const Joi = require('joi')
const router = express.Router()

router.get('/', async (req, res) => {
   // throw new Error('Could not get the generes')
   const generes = await Genere.find().sort('name')
   res.send(generes)
})

router.get('/:id', validateObjectId, async (req, res) => {
   const genere = await Genere.findById(req.params.id)
   if (!genere) return res.status(404).send("There's no such id")
   res.send(genere)
})

router.put('/:id', auth, async (req, res) => {
   const validation = validate(req.body)
   if (validation.error) return res.status(400).send(validation.error)
   const genere = await Genere.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
   )
   if (!genere) return res.status(404).send("There's no such id")
   res.send(genere)
})

router.post('/', auth, async (req, res) => {
   const validation = validate(req.body)
   if (validation.error) return res.status(400).send(validation.error)
   const genere = new Genere({
      name: req.body['name'],
   })
   await genere.save()
   res.send(genere)
})

router.delete('/:id', [auth, admin], async (req, res) => {
   const genere = await Genere.findByIdAndDelete(req.params.id)
   if (!genere)
      return res.status(404).send('The genere with given ID was not found')
   res.send(genere)
})

module.exports = router
