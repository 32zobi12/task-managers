#!/bin/bash

pip install -r backend/requirements.txt

# (опционально) Сборка статики и миграции
python backend/manage.py collectstatic --noinput
python backend/manage.py migrate
