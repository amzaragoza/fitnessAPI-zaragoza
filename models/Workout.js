const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
	userId: {
        type: String,
        required: [true, "User ID is Required"]
    },
    name: {
        type: String,
        required: [true, 'Workout Name is Required']
    },
	duration: {
        type: String,
        required: [true, 'Workout Duration is Required']
    },
	status: {
		type: String,
		default: "pending"
	},
	dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Workout', workoutSchema);