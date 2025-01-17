const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
	user: {
		ref: 'users',
		type: Schema.Types.ObjectId,
		required: true,
	},

	description: {
		type: String,
		required: true,
	},
	expireDate: {
		type: Date,
		required: true,
	},
	files: {
		type: Array,
		default: [],
	},
});

module.exports = mongoose.model('tasks', taskSchema);