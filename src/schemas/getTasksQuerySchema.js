const Joi = require('joi').extend(require('@joi/date'));
const { STATUS } = require('../utils/constants/constants');

const getTasksQuerySchema = Joi.object().keys({
	datemin: Joi.date().format('YYYY/MM/DD HH:mm:ss'),
	datemax: Joi.date().format('YYYY/MM/DD HH:mm:ss').greater(Joi.ref('datemin')),
	search: Joi.string(),
	status: Joi.string()
		.trim()
		.pattern(
			new RegExp(
				`^(${Object.values(STATUS).join('|')})(,(${Object.values(STATUS).join('|')}))*$`
			)
		)
});

module.exports = { getTasksQuerySchema };
