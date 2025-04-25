// DateTimeDisplay.js
import React, { useEffect, useState } from 'react';
import '../styles/DateTimeDisplay.css';

const DateTimeDisplay = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000); // Обновление каждую секунду

        return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }, []);

    const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString('ru-RU', options); // Форматирование даты для русской локали
    };

    return (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>

            <p className='sys'>{formatDate(dateTime)}</p> {/* Отображение отформатированной даты */}
        </div>
    );
};

export default DateTimeDisplay;
