const winston = require('winston')
const { format } = require('winston')
require('winston-mongodb')

logger = winston.createLogger({
   format: format.combine(
      // format.label({ label: '[my-label]' }),
      format.timestamp({
         format: 'YYYY-MM-DD HH:mm:ss',
      }),
      //
      // The simple format outputs
      // `${level}: ${message} ${[Object with everything else]}`
      //
      format.simple()
      //
      // Alternatively you could use this custom printf format if you
      // want to control where the timestamp comes in your final message.
      // Try replacing `format.simple()` above with this:
      //
      // format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
   ),
   transports: [
      new winston.transports.Console(),
      new winston.transports.File({
         filename: 'combined.log',
      }),
      new winston.transports.MongoDB({
         db: 'mongodb://localhost/vidly',
         options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         },
         format: winston.format.combine(winston.format.metadata()),
         // handleExceptions: true,
      }),
   ],
})

module.exports = logger
