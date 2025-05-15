import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (!token) return;

        fetch('http://127.0.0.1:8000/api/user/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }, []);

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
