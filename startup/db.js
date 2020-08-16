const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true) // collection.ensureIndex is deprecated. Use createIndexes instead
const logger = require('../middleware/logger')
const config = require('config')
module.exports = function () {
   const connectedDatabase = config.get('db')
   mongoose
      .connect(connectedDatabase, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      .then(() => logger.info(`Connected to ${connectedDatabase}`))
   // .catch((err) => logger.error('Cannot connect to MongoDB'))  / rejection is handled by logger
}
