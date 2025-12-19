const Task = require('../models/Task');

// GET /api/tasks
exports.getTasks = async (req, res) => {
    try {
        const { priority, completed, sort } = req.query;
        // Filter by logged in user
        let filter = { userId: req.user.id };

        // Filtering
        if (priority) {
            filter.priority = priority;
        }
        if (completed) {
            filter.completed = completed === 'true';
        }

         // Search Filter (Title or Description)
        const { search } = req.query;
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            filter.$or = [
                { title: searchRegex },
                { description: searchRegex }
            ];
        }

        // Custom Priority Sorting (High > Medium > Low)
        if (sort === 'priority') {
            const tasks = await Task.aggregate([
                {
                    $match: {
                        ...filter,
                        // Ensure userId is an ObjectId for aggregation
                        userId: req.user._id
                    }
                },
                {
                    $addFields: {
                        priorityWeight: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$priority", "high"] }, then: 3 },
                                    { case: { $eq: ["$priority", "medium"] }, then: 2 },
                                    { case: { $eq: ["$priority", "low"] }, then: 1 }
                                ],
                                default: 0
                            }
                        }
                    }
                },
                { $sort: { priorityWeight: -1, createdAt: -1 } } // High -> Low, then by Date
            ]);
            return res.json(tasks);
        }

        // Standard Sorting
        let sortOption = {};
        if (sort === 'dueDate') {
            sortOption.dueDate = 1; // Ascending
        } else {
            sortOption.createdAt = -1;
        }

        const tasks = await Task.find(filter).sort(sortOption);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Check user ownership
        if (task.userId && task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
    try {
        console.log('Create Task Body:', req.body); // Debug log
        const { title, description, priority, dueDate } = req.body;

        // Sanitize priority just in case
        let safePriority = priority;
        if (!priority || !['low', 'medium', 'high'].includes(String(priority).toLowerCase().trim())) {
            console.warn(`Invalid priority '${priority}' received, defaulting to 'medium'`);
            safePriority = 'medium';
        } else {
            safePriority = String(priority).toLowerCase().trim();
        }

        const newTask = new Task({
            title,
            description,
            priority: safePriority,
            dueDate,
            userId: req.user.id // Associate with user
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Check user ownership
        if (task.userId && task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Check user ownership
        if (task.userId && task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
