# 📝 Task Manager

Task Manager — это полнофункциональное веб-приложение для управления задачами. Реализован с использованием Django (бэкенд), React (фронтенд) и PostgreSQL (база данных).

---

## 🚀 Возможности

- ✅ Регистрация и авторизация пользователей
- 📌 Создание, редактирование и удаление задач
- 🗂️ Сортировка задач по статусу/дате
- 🔍 Поиск по задачам; темная тема
- 📊 Интерфейс, адаптированный под разные устройства

---

## 🛠️ Стек технологий

**Frontend:** React, JavaScript, HTML, CSS  
**Backend:** Django, Django REST Framework  
**Database:** PostgreSQL  
**Dev Tools:** Git, VSCode

---

## ⚙️ Установка и запуск проекта

### 🔧 Backend (Django)

```bash
cd myproject
python -m venv venv
source venv/bin/activate  # Для Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
