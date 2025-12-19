import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

const Header = ({ onOpenAddTask }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-20">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-linear-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        T
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        TaskMaster
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {user && (
                        <>
                            <span className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300">
                                Hi, {user.name}
                            </span>
                            <button
                                onClick={onOpenAddTask}
                                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                <span className="hidden sm:inline">Add Task</span>
                            </button>
                            <button
                                onClick={logout}
                                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                title="Logout"
                            >
                                <FaSignOutAlt size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
