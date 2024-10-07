## development
######################
ENV_DEV = ./.env.dev
COMPOSE_DEV = ./compose-dev.yaml
NAME_DEV = transcendence-dev
DOCKER_COMMAND_DEV = docker compose -f $(COMPOSE_DEV) --env-file $(ENV_DEV) -p $(NAME_DEV)

dev:
	$(DOCKER_COMMAND_DEV) up -d

dev-down:
	$(DOCKER_COMMAND_DEV) down

dev-logs-web:
	$(DOCKER_COMMAND_DEV) logs web

dev-logs-vue:
	$(DOCKER_COMMAND_DEV) logs vue 

dev-build:
	$(DOCKER_COMMAND_DEV) up --build -d

dev-ps:
	$(DOCKER_COMMAND_DEV) ps

dev-pytest:
	$(DOCKER_COMMAND_DEV) exec web pytest

dev-migrate:
	$(DOCKER_COMMAND_DEV) exec web python manage.py makemigrations game
	$(DOCKER_COMMAND_DEV) exec web python manage.py migrate

dev-migrate-user:
	$(DOCKER_COMMAND_DEV) exec web python manage.py makemigrations user
	$(DOCKER_COMMAND_DEV) exec web python manage.py migrate

dev-migrate-auth:
	$(DOCKER_COMMAND_DEV) exec web python manage.py makemigrations authentication 
	$(DOCKER_COMMAND_DEV) exec web python manage.py migrate

dev-startapp:
	@if [ -z "$(name_app)" ]; then \
		echo "You must provide a name for the app. Usage: make startapp name_app=your_app_name"; \
		exit 1; \
	fi
	$(DOCKER_COMMAND_DEV) exec web python3 manage.py startapp $(name_app)

# Nouvelle commande supp pour arrêter et supprimer tous les conteneurs
dev-supp:
	@echo "Stopping all containers..."; \
	docker stop $$(docker ps -q); \
	echo "Removing all containers..."; \
	docker rm $$(docker ps -aq) || true; \
	echo "All containers stopped and removed."

.PHONY: dev dev-down dev-migrate dev-supp


## production
######################
ENV_PROD = ./.env.prod
COMPOSE_PROD = ./compose-prod.yaml
NAME_PROD = transcendence-prod
DOCKER_COMMAND_PROD = docker compose -f $(COMPOSE_PROD) --env-file $(ENV_PROD) -p $(NAME_PROD)

all:
	$(DOCKER_COMMAND_PROD) up --build -d

down:
	$(DOCKER_COMMAND_PROD) down

# Nouvelle commande supp pour arrêter et supprimer tous les conteneurs
supp:
	@echo "Stopping all containers..."; \
	docker stop $$(docker ps -q); \
	echo "Removing all containers..."; \
	docker rm $$(docker ps -aq) || true; \
	echo "All containers stopped and removed."
data: 
	@echo "docker exec -it db psql -U DB_USER -d DB_NAME -c \"\\l\"" 



.PHONY: all down supp data

