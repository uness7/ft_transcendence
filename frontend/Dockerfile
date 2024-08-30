# Étape de construction
FROM node:16 AS build

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste des fichiers de l'application
COPY . ./
RUN npm run build

## Étape de production
#FROM nginx:alpine
#
## Copier les fichiers construits dans le répertoire de Nginx
#COPY --from=build /app/dist /usr/share/nginx/html
#
## Exposer le port 80
#EXPOSE 80
#
## Démarrer Nginx
#CMD ["nginx", "-g", "daemon off;"]
