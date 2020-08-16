const express = require('express')
const mongoose = require('mongoose')
const { Customer, validate } = require('../models/customer')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/', async (req, res) => {
   const customers = await Customer.find().sort('name')
   res.send(customers)
})

router.post('/', auth, async (req, res) => {
   const validation = validate(req.body)
   if (validation.error) return res.status(400).send(validation.error)
   const customer = new Customer({
      name: req.body['name'],
      isGold: req.body['isGold'],
      phone: req.body['phone'],
   })
   await customer.save()
   res.send(customer)
})

router.put('/:id', auth, async (req, res) => {
   const validation = validate(req.body)
   if (validation.error) return res.status(400).send(validation.error)
   const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
         name: req.body['name'],
         phone: req.body['phone'],
         isGold: req.body['isGold'],
      },
      { new: true }
   )
   if (!customer) return res.status(404).send("The custmer doesn't exist")
   res.send('Zaktualizowano')
})

router.get('/:id', async (req, res) => {
   const customer = await Customer.findById(req.params.id)
   if (!customer) return res.status(404).send('The customer doesnt exist')
   res.send(customer)
})

module.exports = router
