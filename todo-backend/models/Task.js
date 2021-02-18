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
	task: taskSchema,
});

const completedTaskSchema = new Schema({
	task: taskSchema,
});

module.exports.Task = mongoose.model('tasks', taskSchema);
module.exports.WaitingTask = mongoose.model('waitingTasks', waitingTaskSchema);
module.exports.CompletedTask = mongoose.model('completedTasks', completedTaskSchema);