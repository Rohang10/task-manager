import React from 'react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
    const priorityColors = {
        low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
    };

    return (
        <div className={clsx(
            "group relative p-5 rounded-xl border transition-all duration-200 hover:shadow-lg",
            task.completed
                ? "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-75"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        )}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-4">
                    <h3 className={clsx(
                        "text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-all",
                        task.completed && "line-through text-gray-500 dark:text-gray-400"
                    )}>
                        {task.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 min-h-5">
                        {task.description}
                    </p>
                </div>
                <button
                    onClick={() => onToggleComplete(task)}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    {task.completed ? <FaCheckCircle size={24} className="text-blue-600" /> : <FaRegCircle size={24} />}
                </button>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                    <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", priorityColors[task.priority])}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    {task.dueDate && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                    )}
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                        title="Edit"
                    >
                        <FaEdit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                        title="Delete"
                    >
                        <FaTrash size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
