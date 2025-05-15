#!/usr/bin/env bash
set -o errexit  # Останавливает скрипт при любой ошибке

# Установка зависимостей
pip install -r backend/requirements.txt

# Миграции и сборка статики
python backend/manage.py migrate
python backend/manage.py collectstatic --noinput
