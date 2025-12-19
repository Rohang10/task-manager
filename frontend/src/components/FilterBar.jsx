import React, { useEffect, useState } from 'react';

const FilterBar = ({ filter, setFilter, sort, setSort }) => {
    // Local state for debounced search
    const [searchTerm, setSearchTerm] = useState(filter.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilter(prev => ({ ...prev, search: searchTerm }));
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, setFilter]);

    return (
        <div className="flex flex-col xl:flex-row gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 items-start xl:items-center justify-between">

            {/* LEFT SIDE: Filters & Sort */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                {/* Status */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-32.5 shadow-sm outline-none cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Priority */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</label>
                    <select
                        value={filter.priority}
                        onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-32.5 shadow-sm outline-none cursor-pointer"
                    >
                        <option value="all">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sort By</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-35 shadow-sm outline-none cursor-pointer"
                    >
                        <option value="createdAt">Newest First</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
            </div>

            {/* RIGHT SIDE: Search Bar */}
            <div className="w-full xl:w-auto xl:min-w-75">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm transition-colors border outline-none"
                        placeholder="Search tasks..."
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
