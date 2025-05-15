// LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // сбрасываем старую ошибку

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                onLoginSuccess();
                navigate('/tasks');
            } else {
                console.error('Ошибка авторизации:', data);
                setError(data.detail || 'Ошибка входа. Проверьте логин и пароль.');
            }
        } catch (err) {
            console.error('Ошибка сети:', err);
            setError('Ошибка подключения к серверу.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Войти</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default LoginForm;
