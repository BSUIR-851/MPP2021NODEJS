const Task = require('../models/Task.js');
const ActiveTask = require('../models/ActiveTask.js');
const CompletedTask = require('../models/CompletedTask.js');
const errorHandler = require('../utils/errorHandler.js');

module.exports.getAll = async function(req, res) {
	try {
		const tasks = await Position.find({
			user: req.user.id,
		});
		res.status(200).json(tasks);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.getById = async function(req, res) {
	try {
		const task = await Position.findById(req.params.id);
		res.status(200).json(task);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.remove = async function(req, res) {
	try {
		await Task.remove({_id: req.params.id});
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
		date: req.body.date,
		fileSrc: req.file ? req.file.path : '',
	});
	try {
		await task.save();
		res.status(201).json(task);
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.update = async function(req, res) {
	const updated = {
		description: req.body.description,
		date: req.body.date,
	};

	if (req.file) {
		updated.fileSrc = req.file.path;
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

module.exports.complete = function(req, res) {
	try {
		
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.getAllActive = function(req, res) {
	try {
		
	} catch (e) {
		errorHandler(res, e);
	}
};

module.exports.getAllCompleted = function(req, res) {
	try {
		
	} catch (e) {
		errorHandler(res, e);
	}
};