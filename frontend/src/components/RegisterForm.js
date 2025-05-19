// RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onRegisterSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState(false);
    const navigate                = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (username.length < 8) {
            setError('Имя пользователя должно содержать не менее 8 символов');
            return;
        }
        if (password.length < 8) {
            setError('Пароль должен содержать не менее 8 символов');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register/`, {
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

                setTimeout(() => {
                    onRegisterSuccess();
                    navigate('/login');
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
                <label>Имя пользователя:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Пароль:</label>
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
