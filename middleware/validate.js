
module.exports = (validator) => {
    return (req, res, next) => { // <- this is function you want to really return
    const validation = validator(req.body)
    if (validation.error) return res.status(400).send(validation.error)
    next()
    }
}
