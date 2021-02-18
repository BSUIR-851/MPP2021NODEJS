const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
	description: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	files: {
		type: Array,
	},
});

const taskSchema = new Schema({
	description: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	files: {
		type: Array,
	},
});

const taskSchema = new Schema({
	description: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	files: {
		type: Array,
	},
});

module.exports.Task = mongoose.model('tasks', taskSchema);
module.exports.WaitingTask = mongoose.model('waiting_tasks', taskSchema);
module.exports.CompletedTask = mongoose.model('completed_tasks', taskSchema);