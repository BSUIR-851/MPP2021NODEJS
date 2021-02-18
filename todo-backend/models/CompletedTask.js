const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const completedTaskSchema = new Schema({
	task: {
		ref: 'tasks',
		type: Schema.Types.ObjectId,
		required: true,
	},
});

module.exports = mongoose.model('completedTasks', completedTaskSchema);