#!/usr/bin/env bash
set -o errexit  # Останавливает скрипт при любой ошибке

# Установка зависимостей
pip install -r requirements.txt

# Миграции и сборка статики
python manage.py migrate
python manage.py collectstatic --noinput
