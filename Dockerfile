# Utiliser l'image officielle de Nginx
FROM nginx:latest

# Installer OpenSSL et ca-certificates
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Générer un certificat SSL auto-signé
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/selfsigned.key \
    -out /etc/ssl/certs/selfsigned.crt \
    -subj "/C=FR/ST=Region/L=City/O=Organization/OU=Department/CN=localhost"

# Vérifier la présence des certificats
RUN ls -l /etc/ssl/certs/selfsigned.crt /etc/ssl/private/selfsigned.key

# Ajouter le certificat dans le magasin de certificats de confiance
RUN cp /etc/ssl/certs/selfsigned.crt /usr/local/share/ca-certificates/selfsigned.crt && \
    update-ca-certificates

# Copier le fichier de configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Changer le propriétaire et les permissions des fichiers de certificat
RUN chown www-data:www-data /etc/ssl/certs/selfsigned.crt \
    && chown www-data:www-data /etc/ssl/private/selfsigned.key \
    && chmod 644 /etc/ssl/certs/selfsigned.crt \
    && chmod 600 /etc/ssl/private/selfsigned.key

# Exposer les ports 80 et 443
EXPOSE 80 443

