const express = require('express')
const Joi = require('joi')
const app = express()
app.use(express.json())

const generes = [
   { id: 1, name: 'horror' },
   { id: 2, name: 'scifi' },
   { id: 3, name: 'romance' },
   { id: 4, name: 'drama' },
]
app.get('/', (req, res) => {
   res.send('Witaj w Vidly!')
})
app.get('/vidly', (req, res) => {
   res.send(generes)
})
app.put('/vidly/:id', (req, res) => {
   const genere = generes.find((index) => index.id === parseInt(req.params.id))
   //console.log(genere)
   if (!genere) return res.status(404).send("There's no such id")

   const validation = validateGenere(req.body)
   if (validation.error) return res.status(400).send(validation.error)

   genere.name = req.body['name']
   res.send(genere)
})
app.post('/vidly/new', (req, res) => {
   const validation = validateGenere(req.body)
   if (validation.error) return res.status(400).send(validation.error)

   const genere = {}

   genere.id = generes.length + 1
   genere.name = req.body['name']
   generes.push(genere)
   res.send(genere)
})
app.delete('/vidly/delete/:id', (req, res) => {
   // check if course exists
   const genere = generes.find((index) => index.id === parseInt(req.params.id))
   if (!genere)
      return res.status(404).send('The genere with given ID was not found')
   // delete
   const index = generes.indexOf(genere)
   generes.splice(index, 1) //delete this object

   res.send(genere)
})
function validateGenere(genere) {
   const schema = Joi.object({
      name: Joi.string().min(3).required(),
   })
   return schema.validate(genere)
}

app.listen(3000, (req, res) => console.log(`Listening on port 3000...`))
