const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
	user: {
		ref: 'users',
		type: Schema.Types.ObjectId,
	},

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

module.exports = mongoose.model('tasks', taskSchema);