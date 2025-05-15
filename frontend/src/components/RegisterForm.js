// RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onRegisterSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Проверка на длину имени пользователя и пароля
        if (username.length < 8) {
            setError('Имя пользователя должно содержать не менее 8 символов');
            return;
        }
        if (password.length < 8) {
            setError('Пароль должен содержать не менее 8 символов');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 201) {
                setSuccess(true);
                setUsername('');
                setPassword('');

                // Показать сообщение об успешной регистрации на 2 секунды, затем перенаправить
                setTimeout(() => {
                    onRegisterSuccess(); // Вызов функции для обработки успешной регистрации
                    navigate('/login'); // Перенаправление на страницу входа
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Ошибка регистрации');
            }
        } catch (err) {
            setError('Ошибка регистрации');
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
            <button type="submit">Регистрация</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Регистрация успешна!</p>}
        </form>
    );
};

export default RegisterForm;
