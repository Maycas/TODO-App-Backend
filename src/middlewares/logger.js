const { formatDate } = require('../utils/helperFunctions/formatDate')

const logger = (req, res, next) => {
    console.log(`method: ${req.method}, url: ${req.url}, date: ${(formatDate(new Date()))}`)
    next()
}

module.exports = logger