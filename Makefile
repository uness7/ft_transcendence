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

ps:
	$(DOCKER_COMMAND_PROD) ps

down:
	rm -rf ~/.cache/google-chrome/ ~/.cache/mozilla/firefox/
	$(DOCKER_COMMAND_PROD) down

re: down all

supp:
	@echo "Stopping all containers..."; \
	docker stop $$(docker ps -q); \
	echo "Removing all containers..."; \
	docker rm $$(docker ps -aq) || true; \
	echo "All containers stopped and removed."

data:
	@echo "psql -U * -d *"
	@echo "docker exec -it Id psql -U *  -d * "
	@echo "SELECT * FROM NAME; "
	@echo "SELECT username, password FROM user_user;"

dock:
	@echo "docker exec -it id /bin/bash"
	@echo "curl http://localhost:8443/metrics"
	@echo "docker exec -it id sh"

db:
	@. ./.env.prod; \
	if [ -n "$$(docker ps -q -f name=db)" ]; then \
		docker exec -it db psql -U $$DB_USER -d $$DB_NAME; \
	else \
		echo "Le conteneur de base de données nommé 'db' n'est pas en cours d'exécution."; \
	fi

nginx:
	@ if [ -n "$$(docker ps -q -f name=transcendence-prod-nginx-1)" ]; then \
		docker exec -it transcendence-prod-nginx-1 /bin/bash -c "cd /var/www/html && ls -la"; \
	else \
		echo "Le conteneur nommé 'transcendence-prod-nginx-1' n'est pas en cours d'exécution."; \
	fi

web:
	@ if [ -n "$$(docker ps -q -f name=web)" ]; then \
		docker exec -it web /bin/bash -c "ls -la"; \
	else \
		echo "Le conteneur nommé 'web' n'est pas en cours d'exécution."; \
	fi


script:
	chmod +x get_logs.sh

logs: script
	bash ./get_logs.sh transcendence-prod-nginx-1 db web

.PHONY: all down supp data re logs dock script db nginx web


## development
######################
ENV_DEV = ./.env.dev
COMPOSE_DEV = ./compose-dev.yaml
NAME_DEV = transcendence-dev
DOCKER_COMMAND_DEV = docker compose -f $(COMPOSE_DEV) --env-file $(ENV_DEV) -p $(NAME_DEV)

dev:
	$(DOCKER_COMMAND_DEV) up -d

dev-runserver:
	$(DOCKER_COMMAND_DEV) exec web python manage.py runserver

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

dev-createsuperuser:
	$(DOCKER_COMMAND_DEV) exec web python manage.py createsuperuser

dev-migrate:
	$(DOCKER_COMMAND_DEV) exec web python manage.py makemigrations game
	$(DOCKER_COMMAND_DEV) exec web python manage.py migrate

dev-migrate-user:
	$(DOCKER_COMMAND_DEV) exec web python manage.py makemigrations user
	$(DOCKER_COMMAND_DEV) exec web python manage.py migrate

dev-migrate-auth:
	$(DOCKER_COMMAND_DEV) exec web python manage.py makemigrations authentication
	$(DOCKER_COMMAND_DEV) exec web python manage.py migrate

dev-migrate-generic:
	$(DOCKER_COMMAND_DEV) exec web python manage.py makemigrations
	$(DOCKER_COMMAND_DEV) exec web python manage.py migrate

dev-startapp:
	@if [ -z "$(name_app)" ]; then \
		echo "You must provide a name for the app. Usage: make startapp name_app=your_app_name"; \
		exit 1; \
	fi
	$(DOCKER_COMMAND_DEV) exec web python3 manage.py startapp $(name_app)

dev-shell:
	$(DOCKER_COMMAND_DEV) exec web python manage.py shell

.PHONY: dev dev-down dev-migrate


