FROM python:3.12-bookworm

ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1

WORKDIR /app

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port that Django runs on
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

