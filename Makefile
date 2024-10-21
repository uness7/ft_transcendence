## production
######################
ENV_PROD = ./.env.prod
COMPOSE_PROD = ./compose-prod.yaml
NAME_PROD = transcendence-prod
DOCKER_COMMAND_PROD = docker compose -f $(COMPOSE_PROD) --env-file $(ENV_PROD) -p $(NAME_PROD)

all:
	$(DOCKER_COMMAND_PROD) up --build -d
	$(DOCKER_COMMAND_PROD) exec web python manage.py makemigrations
	$(DOCKER_COMMAND_PROD) exec web python manage.py migrate

prod-logs-web:
	$(DOCKER_COMMAND_PROD) logs web

prod-logs-vue:
	$(DOCKER_COMMAND_PROD) logs vue

prod-ps:
	$(DOCKER_COMMAND_PROD) ps

down:
	rm -rf ~/.cache/google-chrome/ ~/.cache/mozilla/firefox/
	$(DOCKER_COMMAND_PROD) down
	
re: down all

# Nouvelle commande supp pour arrêter et supprimer tous les conteneurs
supp:
	@echo "Stopping all containers..."; \
	docker stop $$(docker ps -q); \
	echo "Removing all containers..."; \
	docker rm $$(docker ps -aq) || true; \
	echo "All containers stopped and removed."

data: 
	@echo "psql -U * -d *" 
	@echo "docker exec -it Id psql -U *  -d * " 
	@echo "\d para "
	@echo "SELECT * FROM NAME; "
	@echo "SELECT username, password FROM user_user;"
	
dock:
	@echo "docker exec -it id /bin/bash"
	@echo "curl http://localhost:8000/metrics"
	@echo "docker exec -it id sh"

