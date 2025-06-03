// TaskEditForm.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TaskEditForm.css';

const TaskEditForm = ({ taskId, onCancel, onUpdate }) => {
    const [taskData, setTaskData]   = useState({ title: '', description: '' });
    const [error, setError]         = useState(null);
    const navigate                  = useNavigate();

    // ⬇️ читаем базовый адрес из .env
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    /* ---------- Загрузка текущих данных задачи ---------- */
    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('access');
            if (!token) {
                setError('Токен не найден. Пожалуйста, войдите в систему.');
                return;
            }
            try {
                const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Не удалось получить задачу');
                setTaskData(await res.json());
            } catch (err) {
                setError(err.message);
            }
        };
        fetchTask();
    }, [taskId, API_BASE_URL]);

    /* ---------- Обработчики ---------- */
    const handleChange = e => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            if (!res.ok) throw new Error('Не удалось обновить задачу');
            onUpdate();          // сообщаем родителю
            navigate('/tasks');  // назад к списку
        } catch (err) {
            setError(err.message);
        }
    };

    /* ---------- UI ---------- */
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
                        maxLength={25}
                        required
                        className="task-input"
                    />
                </label>

                <label>
                    Описание:
                    <textarea
                        name="description"
                        value={taskData.description}
                        onChange={handleChange}
                        maxLength={255}
                        required
                        className="task-input1"
                    />
                </label>

                <button type="submit" className="submit-button">Сохранить</button>
                <button type="button" onClick={onCancel} className="cancel-button">Отмена</button>
            </form>
        </div>
    );
};

export default TaskEditForm;
