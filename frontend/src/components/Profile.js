import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (!token) return;

        fetch(`${API_BASE_URL}/user/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Ошибка при получении профиля');
                return res.json();
            })
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }, [API_BASE_URL]);

    if (!user) return <div>Загрузка профиля...</div>;

    return (
        <div className="profile-page">
            <div className="profile-card">
                <img src={user.avatar || '/default-avatar.png'} alt="Аватар" className="avatar" />
                <h2>Имя пользователя: {user.username}</h2>
                <p>Email: {user.email}</p>
                <p>{user.bio}</p>
            </div>
        </div>
    );
};

export default Profile;
