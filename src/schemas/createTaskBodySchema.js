const Joi = require("joi").extend(require('@joi/date'))
const { STATUS } = require('../utils/constants/constants')

const createTaskBodySchema = Joi.object()
    .keys({
        title: Joi.string().required(),
        dueDate: Joi.date().format('YYYY/MM/DD HH:mm:ss').required(),
        status: Joi.string().valid(...Object.values(STATUS))
    })

module.exports = { createTaskBodySchema }