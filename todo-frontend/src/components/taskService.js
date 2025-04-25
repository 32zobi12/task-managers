// taskService.js
export const fetchTasks = async (token) => {
    const response = await fetch('http://127.0.0.1:8000/api/tasks/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Не удалось получить задачи');
    }

    return response.json();
};

export const updateTaskCompletion = async (id, completed, token) => {
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Не удалось обновить задачу');
    }
};

export const deleteTask = async (id, token) => {
    const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Не удалось удалить задачу');
    }
};
