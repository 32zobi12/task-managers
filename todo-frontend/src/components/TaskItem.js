import React from 'react';
import editIcon from '../assets/editIcon.png';
import trashIcon from '../assets/trashIcon.png';
import '../styles/task-item.css';

const TaskItem = ({ task, handleComplete, handleEdit, handleDelete, handleSelectTask, theme }) => {
    const truncateText = (text, limit) => {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    const cardClass = `task-item ${theme} ${task.completed ? 'completed' : ''}`;

    return (
        <div className={cardClass} onClick={() => handleSelectTask(task)}>
            <h3>{task.title}</h3>
            <p className="created-at">{new Date(task.created_at).toLocaleString()}</p>
            <p>{truncateText(task.description, 255)}</p>

            <div className="task-actions">
                <button
                    className="complete-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleComplete(task.id, task.completed);
                    }}
                >
                    {task.completed ? 'Не выполнено' : 'Выполнить'}
                </button>

                <button
                    className="edit-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(task.id);
                    }}
                >
                    <img src={editIcon} alt="Редактировать" className="edit-icon" />
                </button>

                <button
                    className="delete-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                    }}
                >
                    <img src={trashIcon} alt="Удалить" className="trash-icon" />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
