#!/usr/bin/bash

source .env.dev

python manage.py makemigrations
python manage.py migrate

gunicorn settings.wsgi:application --bind 0.0.0.0:8000
