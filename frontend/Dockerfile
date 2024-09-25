FROM node:18

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Construire l'application Vue.js pour la production
RUN npm run build

# Installer le serveur HTTP pour servir les fichiers construits
RUN npm install -g http-server

# Démarrer le serveur http-server sur le port 80
CMD ["http-server", "dist", "-p", "80"]

# Exposer le port 80 à l'intérieur du conteneur
EXPOSE 80

