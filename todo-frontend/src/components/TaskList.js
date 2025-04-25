import React, { useEffect, useState } from 'react';
import TaskEditForm from './TaskEditForm';
import DateTimeDisplay from "./DateTimeDisplay";
import TaskItem from './TaskItem';
import FilterButtons from './FilterButtons';
import { fetchTasks, updateTaskCompletion, deleteTask } from './taskService';
import '../styles/TaskList.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');




    const loadTasks = async () => {
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            setLoading(false);
            return;
        }
        try {
            const data = await fetchTasks(token);
            setTasks(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadTasks();
        fetch(`/api/tasks/?search=${searchTerm}`)
            .then(res => res.json())
            .then(data => setTasks(data));
    }, [searchTerm]);
    const handleComplete = async (id, completed) => {
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден.');
            return;
        }
        try {
            await updateTaskCompletion(id, completed, token);
            loadTasks();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('access');
        if (!token) {
            setError('Токен не найден.');
            return;
        }
        try {
            await deleteTask(id, token);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = (id) => {
        setEditingTaskId(id);
    };

    const handleUpdate = () => {
        setEditingTaskId(null);
        loadTasks();
    };

    const handleSelectTask = (task) => {
        setSelectedTask(task);
    };

    const handleBackToList = () => {
        setSelectedTask(null);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    if (loading) return <div>Загрузка задач...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="task-list">

            <DateTimeDisplay/>
            <h2>Список задач</h2>
            <input type="text" placeholder="Search task..." onChange={(e) => setSearchTerm(e.target.value)}/>

            <FilterButtons setFilter={setFilter}/>

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
                    <button onClick={handleBackToList}>Вернуться к списку</button>
                </div>
            ) : (
                filteredTasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        handleComplete={handleComplete}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleSelectTask={handleSelectTask}
                    />
                ))
            )}
        </div>
    );

};

export default TaskList;
