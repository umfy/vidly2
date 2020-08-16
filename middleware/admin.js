module.exports = function (req, res, next) {
   // 401 unauthorised
   // 403 forbidded
   if (!req.user.isAdmin) return res.status(403).send('Access denied')

   next()
}
