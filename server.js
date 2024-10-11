require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require("./models/todoList");

var app = express();
app.use(cors());
app.use(express.json());

// Use the environment variable for the MongoDB URI
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Check for database connection success
mongoose.connection.once('open', () => {
    console.log("MongoDB connected successfully!");
});

// Check for database connection errors
mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

// Get saved tasks from the database
app.get("/getTodoList", (req, res) => {
    TodoModel.find({})
        .then((todoList) => res.json(todoList))
        .catch((err) => res.json(err));
});

// Add new task to the database
app.post("/addTodoList", (req, res) => {
    TodoModel.create({
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline, 
    })
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

// Update task fields (including deadline)
// Update task fields (including completed time)
app.post("/updateTodoList/:id", (req, res) => {
    const id = req.params.id;
    const { task, status, deadline } = req.body;

    // If the status is being updated to "Completed", set the completedTime to the current time
    const updateData = {
        task,
        status,
        deadline,
        completedTime: status === 'Completed' ? new Date() : null, // Store the current time if the task is completed
    };

    TodoModel.findByIdAndUpdate(id, updateData, { new: true })
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

// Delete task from the database
app.delete("/deleteTodoList/:id", (req, res) => {
    const id = req.params.id;
    TodoModel.findByIdAndDelete({ _id: id })
        .then((todo) => res.json(todo))
        .catch((err) => res.json(err));
});

// Use the environment variable for the port
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
