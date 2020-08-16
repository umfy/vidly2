require('express-async-errors')
const logger = require('../middleware/logger')

module.exports = function () {
   // It handles uncaught exceptions \/
   process.on('uncaughtException', (ex) => {
      console.log('we got uncaught EXCEPTION')
      logger.error('', ex)
      //process.exit(1)
   })

   process.on('unhandledRejection', (ex) => {
      console.log('we got unhandled REJECTION')
      logger.info('', ex)
      //   process.exit(1)  // this sucks, it should wait for database to log error
   })
}
