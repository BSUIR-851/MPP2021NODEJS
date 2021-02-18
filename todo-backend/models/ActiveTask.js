const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeTaskSchema = new Schema({
	task: {
		ref: 'tasks',
		type: Schema.Types.ObjectId,
		required: true,
	},
});

module.exports = mongoose.model('activeTasks', activeTaskSchema);