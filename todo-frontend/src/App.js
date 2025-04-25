// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleRegisterSuccess = () => {
        // После регистрации перенаправляем на вход
    };

    const handleLogout = () => {
        localStorage.removeItem('access');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="app-container">
                <h1 className="app-title">Task Manager</h1>

                <nav className="navigation">
                    {isAuthenticated ? (
                        <>
                            <Link to="/tasks" className="nav-button">Мои задачи</Link>
                            <Link to="/create" className="nav-button">Создать задачу</Link>
                            <button className="nav-button logout-button" onClick={handleLogout}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-button">Вход</Link>
                            <Link to="/register" className="nav-button">Регистрация</Link>
                        </>
                    )}
                </nav>
                <div className="content">
                    <Routes>
                        <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <LoginForm onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/create" element={isAuthenticated ? <TaskForm /> : <LoginForm onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/register" element={<RegisterForm onRegisterSuccess={handleRegisterSuccess} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
