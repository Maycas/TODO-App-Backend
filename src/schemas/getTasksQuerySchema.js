const Joi = require("joi").extend(require('@joi/date'))
const { STATUS } = require('../utils/constants/constants')

const getTasksQuerySchema = Joi.object()
    .keys({
        datemin: Joi.date().format('YYYY/MM/DD HH:mm:ss'),
        datemax: Joi.date().format('YYYY/MM/DD HH:mm:ss').greater(Joi.ref('datemin')),
        search: Joi.string(),
        status: Joi.string().valid(...Object.values(STATUS))
    })

module.exports = { getTasksQuerySchema }