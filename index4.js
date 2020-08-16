const express = require('express')
const app = express()
const logger = require('./middleware/logger')
require('./startup/unhandled')() // IT IS!
require('./startup/routes')(app)
require('./startup/db')() // it's function, so it needs to be called
require('./startup/config')()
require('./startup/validation')()

//     EXCEPTION
// throw new Error('FATALNIE')
//     REJECTION
//const p = Promise.reject(new Error('Something failed miserably!'))
//p.then(() => console.log('Done'))

const port = process.env.Port || 3000
const server = app.listen(port, (req, res) =>
   logger.info(`Listening on port 3000...`)
)
module.exports = server
