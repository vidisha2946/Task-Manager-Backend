const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Pending" // Default to "Pending"
    },
    deadline: {
        type: Date,
    },
    completedTime: {
        type: Date,  // New field to store the time when task is completed
    },
});

const todoList = mongoose.model("todo", todoSchema);

module.exports = todoList;
