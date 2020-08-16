const express = require('express')
const mongoose = require('mongoose')
const generes = require('./routes/generes')
const customers = require('./routes/customers')
const Joi = require('joi')
const app = express()

app.use(express.json())
app.use('/api/generes', generes)
app.use('/api/customers', customers)

mongoose
   .connect('mongodb://localhost:27017/vidly', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => console.log('Connected to MongoDB'))
   .catch((err) => console.log('Cannot connect to MongoDB'))

const port = process.env.Port || 3000
app.listen(port, (req, res) => console.log(`Listening on port 3000...`))
