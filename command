**construire et démarrer les services**
docker compose up -d

**vérifiez que les conteneurs sont en cours d'exécution**
docker-compose ps

**exécuter psql dans un conteneur et se connecter à PostgreSQL en utilisant le réseau Docker**
docker compose exec db psql -U django transcendence

postgres://django:naplein42@localhost:5432/transcendence

**utilisez la commande SQL suivante pour créer une nouvelle base de données**
CREATE DATABASE nom_de_la_base_de_donnees;

**vérifier que la base de données a été créée**
\l

\l pour voir liste base de donne 

voir version de postgres
SELECT VERSION();





**supprimer base de donnee**
DROP DATABASE nom_de_la_base;

**Pour créer un nouvel utilisateur PostgreSQL**
CREATE USER nom_utilisateur WITH PASSWORD 'mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE nom_de_la_base TO nom_utilisateur;

**Pour voir les données stockées dans une table**
SELECT \* FROM nom_table;

DELETE FROM nom_table
WHERE condition;

\d nom_table = afficher la structure de la table :
\? Commandes Disponibles :

**lister tous les volumes existants**
docker volume ls

**stopez le conteneur dans le compose**

docker-compose down --volumes
docker compose down

**Pour supprimer un volume spécifique**
docker volume rm <volume_name>

**Pour supprimer tous les volumes**
docker volume prune

**stoper tous les conteneurs**
docker stop $(docker ps -q)

**Supprimer tous les conteneurs (si nécessaire)**
docker rm $(docker ps -a -q)

**Supprimer le volume**
docker volume rm 1-transcendence_pgdata

# docker ps <--- pour afficher les dockers

docker exec -it mariadb bash
mysql -u root -p

# SHOW DATABASES; <--- juste pour afficher les databases

USE wordpress;
SHOW TABLES;

SELECT DISTINCT User FROM mysql.user;
EXIT;

docker stop $(docker ps -qa) ; docker rm $(docker ps -qa) ; docker rmi -f $(docker images -qa) ; docker volume rm $(docker volume ls -q) ; docker network rm $(docker network ls -q) 2>/dev/null

---

---

docker run --name postgres -e POSTGRES_PASSWORD=ouissem -d postgres

lancer un conteneur name pour le nom, -e pour ddefinir la variable denvirronement et quelle egale a ouissem, -d quelle image on utilise pour creer le conteneur

docker exec --user postgres -it postgres psql
permet de lancer une commande dans le conteneur , =postgres, avec la commande psql, client qui nous permet dinteragir avec le service postgresql qui lui gere la base de donnee,

--user = avec quelle lutilisateur ?
-it = je veux que ca se passe dans ce terminal (interactive).

docker build -t mypostgres .
creer, build une image a partir dun dockerfiles -t ; lui donner un nom et . pour dire que le dockerfiles est dans le dossier actuel
