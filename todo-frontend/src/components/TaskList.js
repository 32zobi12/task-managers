import React, { useEffect, useState, useCallback } from 'react';
import TaskEditForm from './TaskEditForm';
import DateTimeDisplay from './DateTimeDisplay';
import TaskItem from './TaskItem';
import FilterButtons from './FilterButtons';
import { deleteTask } from './taskService';
import '../styles/TaskList.css';
import debounce from 'lodash/debounce';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Безопасное начальное значение темы
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.body.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'light';
    });

    // Загрузка задач
    const loadTasks = async (search = '') => {
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке задач. Проверьте API.');
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce((query) => {
        loadTasks(query);
    }, 500), []);

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    // Отслеживание изменения темы
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const observer = new MutationObserver(() => {
            const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
            setTheme(currentTheme);
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    // Удаление задачи
    const handleDelete = async (id) => {
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден.');
            return;
        }

        try {
            await deleteTask(id, token);
            setTasks((prev) => prev.filter(task => task.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (id) => setEditingTaskId(id);

    const handleUpdate = () => {
        setEditingTaskId(null);
        loadTasks();
    };

    const handleSelectTask = (task) => setSelectedTask(task);

    const handleComplete = async (id, currentStatus) => {
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !currentStatus }),
            });

            if (!response.ok) {
                throw new Error('Не удалось обновить статус задачи.');
            }

            const updatedTask = await response.json();
            setTasks(prevTasks =>
                prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const handleBackToList = () => setSelectedTask(null);

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    if (loading) return <div>Загрузка задач...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="task-list">
            <DateTimeDisplay />

            <h2>Список задач</h2>

            <input
                type="text"
                placeholder="Search task..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <FilterButtons setFilter={setFilter} />

            {editingTaskId ? (
                <TaskEditForm
                    taskId={editingTaskId}
                    onCancel={() => setEditingTaskId(null)}
                    onUpdate={handleUpdate}
                />
            ) : selectedTask ? (
                <div className="task-details">
                    <h3>Описание задачи</h3>
                    <p><strong>Тема:</strong> {selectedTask.title}</p>
                    <p><strong>Описание:</strong> {selectedTask.description}</p>
                    <p><strong>Выполнена:</strong> {selectedTask.completed ? 'Да' : 'Нет'}</p>
                    <p>{new Date(selectedTask.created_at).toLocaleString()}</p>
                    <button onClick={handleBackToList}>Вернуться к списку</button>
                </div>
            ) : (
                filteredTasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleSelectTask={handleSelectTask}
                        handleComplete={handleComplete}
                        theme={theme}
                    />
                ))
            )}
        </div>
    );
};

export default TaskList;
