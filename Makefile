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

up:
	$(DOCKER_COMMAND_PROD) up -d

prod-logs-web:
	$(DOCKER_COMMAND_PROD) logs web

down:
	$(DOCKER_COMMAND_PROD) down

del-cache:
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
