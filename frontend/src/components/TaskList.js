// src/components/TaskList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import TaskEditForm from './TaskEditForm';
import DateTimeDisplay from './DateTimeDisplay';
import TaskItem from './TaskItem';
import FilterButtons from './FilterButtons';
import { deleteTask } from './taskService';
import '../styles/TaskList.css';
import debounce from 'lodash/debounce';

const TaskList = () => {
    // ---------- state ----------
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // ---------- тема ----------
    const [theme, setTheme] = useState(() =>
        typeof window !== 'undefined' && document.body.classList.contains('dark')
            ? 'dark'
            : 'light'
    );

    /* Отслеживаем изменения класса <body>,
       чтобы тема моментально подхватывалась */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const observer = new MutationObserver(() => {
            setTheme(document.body.classList.contains('dark') ? 'dark' : 'light');
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // ---------- загрузка задач ----------
    const loadTasks = async (search = '') => {
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/tasks/?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) throw new Error('Ошибка при загрузке задач. Проверьте API.');
            setTasks(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ---------- поиск с debounce ----------
    const debouncedSearch = useCallback(
        debounce((q) => loadTasks(q), 500),
        []
    );
    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, debouncedSearch]);

    // ---------- callback-и ----------
    const handleDelete = async (id) => {
        const token = localStorage.getItem('access');
        if (!token) return setError('Токен не найден.');
        try {
            await deleteTask(id, token);
            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleComplete = async (id, done) => {
        const token = localStorage.getItem('access');
        if (!token) return setError('Токен не найден.');
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !done }),
            });
            if (!res.ok) throw new Error('Не удалось обновить статус задачи.');
            const updated = await res.json();
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        } catch (err) {
            setError(err.message);
        }
    };

    // ---------- фильтр ----------
    const filteredTasks = tasks.filter((t) =>
        filter === 'completed' ? t.completed : filter === 'incomplete' ? !t.completed : true
    );

    // ---------- UI ----------
    if (loading) return <div>Загрузка задач...</div>;
    if (error)   return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className={theme}>          {/* обёртка с классом темы */}
            <div className="task-list">    {/* прежний контейнер */}
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
                        onUpdate={() => {
                            setEditingTaskId(null);
                            loadTasks();
                        }}
                    />
                ) : selectedTask ? (
                    <div className="task-details">
                        <h3>Описание задачи</h3>
                        <p><strong>Тема:</strong> {selectedTask.title}</p>
                        <p><strong>Описание:</strong> {selectedTask.description}</p>
                        <p><strong>Выполнена:</strong> {selectedTask.completed ? 'Да' : 'Нет'}</p>
                        <p>{new Date(selectedTask.created_at).toLocaleString()}</p>
                        <button onClick={() => setSelectedTask(null)}>Вернуться к списку</button>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            theme={theme}               // передаём тему карточке
                            handleEdit={(id) => setEditingTaskId(id)}
                            handleDelete={handleDelete}
                            handleSelectTask={(t) => setSelectedTask(t)}
                            handleComplete={handleComplete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;
