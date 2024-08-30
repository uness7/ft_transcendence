FROM python:3.12-bookworm

# Mettre à jour pip
RUN pip install --upgrade pip

WORKDIR /app

# Copier le fichier de dépendances et installer les dépendances Python
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code
COPY . .

# Exposer le port que Django utilise
EXPOSE 8000






