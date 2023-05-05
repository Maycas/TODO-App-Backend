const mongoose = require('mongoose');
const { STATUS } = require('../utils/constants/constants')

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	dueDate: {
		type: String,
		required: true,
	},
	status: {
		type: String,
    enum: Object.values(STATUS),
		required: true,
	},
	createdAt: {
		type: String,
		required: true,
	},
	modifiedAt: String,
	deletedAt: String,
});

module.exports = mongoose.model('Task', taskSchema);
