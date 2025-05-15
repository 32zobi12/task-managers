#!/bin/bash

# Выполнение миграций
python manage.py migrate

# Сборка статических файлов
python manage.py collectstatic --noinput
