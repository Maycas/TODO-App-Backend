const express = require('express');
const { formatDate } = require('../utils/helperFunctions/formatDate');
const { STATUS } = require('../utils/constants/constants');

const Task = require('../models/task.model');

const { fieldFormatValidator } = require('../middlewares/validator');
const { getTasksQuerySchema } = require('../schemas/getTasksQuerySchema');
const { createTaskBodySchema } = require('../schemas/createTaskBodySchema');
const {
	updateTasksParamsSchema,
} = require('../schemas/updateTaskParamsSchema');

const router = express.Router();

// GET All tasks - /tasks
router.get(
	'/',
	fieldFormatValidator('query')(getTasksQuerySchema),
	(req, res, next) => {
		const { datemin, datemax, search, status } = req.query;

		const filter = {};
		if (datemin) filter.dueDate = { ...filter.dueDate, $gte: datemin };
		if (datemax) filter.dueDate = { ...filter.dueDate, $lte: datemax };
		if (search) filter.title = { $regex: search, $options: 'i' };
		if (status) filter.status = { $in: status.split(',') };

		Task.find(filter)
			.then((tasks) => res.status(200).json(tasks))
			.catch((error) => res.status(500).json({ msg: error.message }));
	}
);

// GET A task - /tasks/:id
router.get('/:id', (req, res, next) => {
	const taskId = req.params.id;

	Task.findById(taskId)
		.then((task) =>
			task
				? res.status(200).json(task)
				: res.status(404).json({ msg: 'Task not found' })
		)
		.catch((error) => res.status(500).json({ msg: error.message }));
});

// POST A task - /tasks
router.post(
	'/',
	fieldFormatValidator('body')(createTaskBodySchema),
	(req, res, next) => {
		const { title, dueDate } = req.body;

		// Check duplicated tasks
		Task.findOne({ title: title })
			.then((task) => {
				if (task) {
					res.status(400).json({ msg: 'Task already exits' });
				} else {
					Task.create({
						title: title,
						dueDate: dueDate,
						status: STATUS.PENDING,
						createdAt: formatDate(new Date()),
					})
						.then((task) => res.status(200).json(task))
						.catch((error) => res.status(500).json({ msg: error.message }));
				}
			})
			.catch((error) => res.status(500).json({ msg: error.message }));
	}
);

// DELETE A task - /tasks/:id
router.delete('/:id', (req, res, next) => {
	const taskId = req.params.id;
	const { forceDelete } = req.query;

	Task.findById(taskId)
		.then((task) => {
			if (!task) {
				res.status(404).json({ msg: `Task with id ${taskId} doesn't exist` });
			} else {
				if (forceDelete) {
					Task.findByIdAndDelete(taskId)
						.then(() =>
							res
								.status(200)
								.json({ msg: 'Task successfully removed from Database' })
						)
						.catch((error) => res.status(500).json({ msg: error.message }));
				} else {
					Task.findByIdAndUpdate(
						taskId,
						{
							$set: {
								status: STATUS.DELETED,
								deletedAt: formatDate(new Date()),
							},
						},
						{
							new: true,
						}
					)
						.then((updatedTask) => res.status(200).json(updatedTask))
						.catch((error) => res.status(500).json({ msg: error.message }));
				}
			}
		})
		.catch((error) => res.status(500).json({ msg: error.message }));
});

// PUT Update a task - /tasks/:id
router.put(
	'/:id',
	fieldFormatValidator('body')(updateTasksParamsSchema),
	(req, res, next) => {
		const taskId = req.params.id;
		const { title, dueDate, status } = req.body;

		Task.findById(taskId)
			.then((taskToUpdate) => {
				if (!taskToUpdate) {
					res.status(404).json({ msg: `Task with id ${taskId} doesn't exist` });
				} else {
					Task.findByIdAndUpdate(taskId, {
						$set: {
							title: title || taskToUpdate.title,
							dueDate: dueDate || taskToUpdate.dueDate,
							status: status || taskToUpdate.status,
							modifiedAt: formatDate(new Date()),
						},
					})
						.then((updatedTask) =>
							res.status(200).json({ msg: 'Task updated successfully' })
						)
						.catch((error) => res.status(500).json({ msg: error.message }));
				}
			})
			.catch((error) => res.status(500).json({ msg: error.message }));
	}
);

module.exports = router;
