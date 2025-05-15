// TaskEditForm.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TaskEditForm.css'; // Импорт стилей

const TaskEditForm = ({ taskId, onCancel, onUpdate }) => {
    const [taskData, setTaskData] = useState({ title: '', description: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('access');
            if (!token) {
                setError('Токен не найден. Пожалуйста, войдите в систему.');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Не удалось получить задачу');
                }

                const data = await response.json();
                setTaskData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTask();
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error('Не удалось обновить задачу');
            }

            onUpdate(); // Вызов функции обновления после успешного редактирования
            navigate('/tasks'); // Перенаправление на страницу задач после обновления
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="task-edit-form-container">
            <h2>Редактировать задачу</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="task-edit-form">
                <label>
                    Заголовок:
                    <input
                        type="text"
                        name="title"
                        value={taskData.title}
                        onChange={handleChange}
                        required
                        maxLength={25} // Ограничение на 25 символов
                        className="task-input"
                    />
                </label>
                <label>
                    Описание:
                    <textarea
                        name="description"
                        value={taskData.description}
                        onChange={handleChange}
                        required
                        maxLength={255} // Ограничение на 255 символов
                        className="task-input"
                    />
                </label>
                <button type="submit" className="submit-button">Сохранить</button>
                <button type="button" onClick={onCancel} className="cancel-button">Отмена</button>
            </form>
        </div>
    );
};

export default TaskEditForm;
