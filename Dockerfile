FROM node:lts-alpine as build

RUN mkdir /app

COPY ./frontend /app/frontend

WORKDIR /app/frontend

RUN npm update
RUN npm install
RUN npm run build
FROM nginx:1.25.3

RUN rm -rf /var/www/html
RUN mkdir -p /etc/nginx/ssl

COPY --from=build /app/frontend/dist /var/www/html

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/selfsigned.key \
    -out /etc/ssl/certs/selfsigned.crt \
    -subj "/C=FR/ST=Region/L=City/O=Organization/OU=Department/CN=localhost"

# Copier le fichier de configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Changer le propriétaire et les permissions des fichiers de certificat
RUN chown www-data:www-data /etc/ssl/certs/selfsigned.crt \
    && chown www-data:www-data /etc/ssl/private/selfsigned.key \
    && chmod 644 /etc/ssl/certs/selfsigned.crt \
    && chmod 600 /etc/ssl/private/selfsigned.key

EXPOSE 8443

CMD ["nginx", "-g", "daemon off;"]
