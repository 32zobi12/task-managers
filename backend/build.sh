#!/usr/bin/env bash
set -o errexit

# Установка зависимостей
pip install -r requirements.txt

# Миграции и сборка статики
python manage.py migrate
python manage.py collectstatic --noinput

# Создание суперпользователя (если не существует)
echo "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='myd').exists():
    User.objects.create_superuser('myd', 'admin@example.com', 'jjv2xUquDC4uc2S')
" | python manage.py shell
