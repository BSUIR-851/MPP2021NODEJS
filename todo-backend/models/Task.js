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

const waitingTaskSchema = new Schema({
	task: {
		type: taskSchema,
		required: true,
	},
});

const completedTaskSchema = new Schema({
	task: {
		type: taskSchema,
		required: true,
	},
});

module.exports.Task = mongoose.model('tasks', taskSchema);
module.exports.WaitingTask = mongoose.model('waitingTasks', waitingTaskSchema);
module.exports.CompletedTask = mongoose.model('completedTasks', completedTaskSchema);