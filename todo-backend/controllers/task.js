const Task = require('../models/Task.js');
const ActiveTask = require('../models/ActiveTask.js');
const CompletedTask = require('../models/CompletedTask.js');
const errorHandler = require('../utils/errorHandler.js');

module.exports.getAll = async function(req, res) {
	try {
		const tasks = await Task.find({
			user: req.user.id,
		});
		res.status(200).json(tasks);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.getById = async function(req, res) {
	try {
		const task = await Task.findById(req.params.id);
		res.status(200).json(task);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.remove = async function(req, res) {
	try {
		await Task.remove({_id: req.params.id});
		await ActiveTask.remove({task: req.params.id});
		await CompletedTask.remove({task: req.params.id});
		res.status(200).json({
			message: 'Task has been deleted.'
		});
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.create = async function(req, res) {
	const task = new Task({
		user: req.user.id,
		description: req.body.description,
		expireDate: req.body.expireDate,
		files: req.files.map((file) => {
			return file.path;
		}),
	});
	try {
		await task.save();
		const activeTask = new ActiveTask({
			task: task._id,
			user: req.user.id,
		});
		await activeTask.save();
		res.status(201).json(task);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.update = async function(req, res) {
	const updated = {
		description: req.body.description,
		expireDate: req.body.expireDate,
	};

	if (req.files) {
		updated.files = req.files.map((file) => {
			return file.path;
		});
	}

	try {
		const task = await Task.findOneAndUpdate(
			{_id: req.params.id},
			{$set: updated},
			{new: true},
		);
		res.status(200).json(task);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.complete = async function(req, res) {
	try {
		await ActiveTask.remove({task: req.params.id});
		const completedTask = new CompletedTask({
			task: req.params.id,
			user: req.user.id,
		});
		await completedTask.save();
		const task = await Task.findById(req.params.id);
		res.status(200).json(task);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.getAllActive = async function(req, res) {
	try {
		const activeTasksShort = await ActiveTask.find({
			user: req.user.id,
		});
		let activeTasksFull = [];
		let activeTaskFull = {};
		for (const activeTaskShort of activeTasksShort) {
			activeTaskFull = await Task.findById(activeTaskShort.task);
			activeTasksFull.push(activeTaskFull);
		}
		res.status(200).json(activeTasksFull);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.getAllCompleted = async function(req, res) {
	try {
		const completedTasksShort = await CompletedTask.find({
			user: req.user.id,
		});
		let completedTasksFull = [];
		let completedTaskFull = {};
		for (const completedTaskShort of completedTasksShort) {
			completedTaskFull = await Task.findById(completedTaskShort.task);
			completedTasksFull.push(completedTaskFull);
		}
		res.status(200).json(completedTasksFull);
	} catch (e) {
		errorHandler(res, e);
	}
};