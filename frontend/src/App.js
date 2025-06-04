import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';
import './styles/themes.css'; // <-- Добавим файл тем
import Profile from './components/Profile';
import { FaSun, FaMoon } from 'react-icons/fa';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        document.body.classList.toggle('dark', darkMode);
    }, [darkMode]);
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleRegisterSuccess = () => {
        // после регистрации можно перенаправлять на вход
    };

    const handleLogout = () => {
        localStorage.removeItem('access');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
                <div className="header">
                    <h1 className="app-title">TODO-Manager</h1>
                    <div className="theme-toggle-wrapper">
                        <input
                            type="checkbox"
                            id="theme-toggle"
                            checked={darkMode}
                            onChange={() => {
                                const newTheme = !darkMode;
                                setDarkMode(newTheme);
                                localStorage.setItem('theme', newTheme ? 'dark' : 'light');
                            }}
                        />
                        <label htmlFor="theme-toggle" className="theme-toggle-label">
                            <span className="icon sun"><FaSun/></span>
                            <span className="icon moon"><FaMoon/></span>
                            <span className="ball"></span>
                        </label>
                    </div>

                </div>
                <nav className="navigation">
                    {isAuthenticated ? (
                        <>
                            <Link to="/tasks" className="nav-button">Мои задачи</Link>
                            <Link to="/create" className="nav-button">Создать задачу</Link>
                            <Link to="/profile" className="nav-button">Профиль</Link>
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
                        <Route path="/profile" element={isAuthenticated ? <Profile /> : <LoginForm onLoginSuccess={handleLoginSuccess} />} />

                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;