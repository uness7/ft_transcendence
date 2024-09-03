FROM python:3.12-bookworm

# turn off automatic check for pip updates
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
# do not write .pyc files
ENV PYTHONDONTWRITEBYTECOTE 1
# ensure Docker does not buffer console output
ENV PYTHONBUFFERED 1

WORKDIR /app

# install requirements
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
