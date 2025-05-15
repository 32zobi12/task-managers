// TaskForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TaskForm.css'; // Импорт стилей

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();


        const token = localStorage.getItem('access');
        if (!token) {
            setError('Необходимо авторизоваться для создания задачи');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description }),
            });

            const data = await response.json();


            if (response.ok) {
                setSuccess('Задача создана успешно!');
                setTitle('');
                setDescription('');
                setError('');
                navigate('/tasks'); // Переход на страницу задач после создания
            } else {
                setError(`Ошибка: ${data.detail || 'Неизвестная ошибка'}`);
            }
        } catch (error) {
            setError('Ошибка при создании задачи');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="task-form-container">
            <h2>Создать задачу</h2>
            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                    <label htmlFor="title">Название задачи:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={25} // Ограничение на 25 символов
                        required
                        className="task-input"
                        placeholder="Введите название задачи"
                    />
                    <small>{title.length}/25 </small> {/* Показываем количество введенных символов */}
                </div>
                <div className="form-group">
                    <label>Описание задачи:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={255} // Ограничение на 255 символов
                        required
                        className="task-input"
                        placeholder="Введите описание задачи"
                    />
                    <small>{description.length}/255</small> {/* Показываем количество введенных символов */}
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Создание...' : 'Создать задачу'}
                </button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default TaskForm;
