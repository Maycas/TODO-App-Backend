const Joi = require("joi").extend(require('@joi/date'))
const { STATUS } = require('../utils/constants/constants')

const updateTasksParamsSchema = Joi.object()
    .keys({
        title: Joi.string().required(),
        dueDate: Joi.date().format('YYYY/MM/DD HH:mm:ss'),
        status: Joi.string().valid(...Object.values(STATUS))
    })

module.exports = { updateTasksParamsSchema }