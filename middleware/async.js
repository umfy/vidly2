// this func is useless when using express-async-errors
module.exports = function asyncMiddleware(handler) {
   return async (req, res, next) => {
      try {
         await handler(req, res)
      } catch (ex) {
         next(ex)
      }
   }
}
