ENV_PROD = ./.env.prod
COMPOSE_PROD = ./compose-prod.yaml
NAME_PROD = transcendence-prod
DOCKER_COMMAND_PROD = docker compose -f $(COMPOSE_PROD) --env-file $(ENV_PROD) -p $(NAME_PROD)

BLUE := \033[34m
GREEN := \033[32m
RED := \033[31m
RESET := \033[0m

all: check-env
	@echo "$(BLUE)Starting production environment...$(RESET)"
	$(DOCKER_COMMAND_PROD) up --build -d
	@echo "$(BLUE)Running migrations...$(RESET)"
	$(DOCKER_COMMAND_PROD) exec web python manage.py makemigrations
	$(DOCKER_COMMAND_PROD) exec web python manage.py migrate
	@echo "$(GREEN)Setup complete!$(RESET)"

check-env:
	@if [ ! -f $(ENV_PROD) ]; then \
		echo "$(RED)Error: $(ENV_PROD) file not found!$(RESET)"; \
		exit 1; \
	fi

ps:
	@echo "$(BLUE)Current containers:$(RESET)"
	$(DOCKER_COMMAND_PROD) ps

up:
	@echo "$(BLUE)Starting containers...$(RESET)"
	$(DOCKER_COMMAND_PROD) up -d

down:
	@echo "$(BLUE)Stopping containers...$(RESET)"
	$(DOCKER_COMMAND_PROD) down

prod-logs-web:
	$(DOCKER_COMMAND_PROD) logs web --tail=100 -f

logs: script
	@echo "$(BLUE)Collecting logs from all services...$(RESET)"
	bash ./get_logs.sh transcendence-prod-nginx-1 db web

createsuperuser:
	@echo "$(BLUE)Creating superuser...$(RESET)"
	$(DOCKER_COMMAND_PROD) exec web python manage.py createsuperuser

db:
	@. ./.env.prod; \
	if [ -n "$$(docker ps -q -f name=db)" ]; then \
		echo "$(BLUE)Connecting to database...$(RESET)"; \
		docker exec -it db psql -U $$DB_USER -d $$DB_NAME; \
	else \
		echo "$(RED)Database container 'db' is not running!$(RESET)"; \
	fi

del-cache:
	@echo "$(BLUE)Cleaning browser caches...$(RESET)"
	rm -rf ~/.cache/google-chrome/ ~/.cache/mozilla/firefox/
	$(DOCKER_COMMAND_PROD) down

re: down all

supp:
	@echo "$(BLUE)Stopping all containers...$(RESET)"
	@docker stop $$(docker ps -q) 2>/dev/null || echo "No containers running"
	@echo "$(BLUE)Removing all containers...$(RESET)"
	@docker rm $$(docker ps -aq) 2>/dev/null || echo "No containers to remove"
	@echo "$(GREEN)All containers stopped and removed.$(RESET)"

nginx:
	@if [ -n "$$(docker ps -q -f name=transcendence-prod-nginx-1)" ]; then \
		echo "$(BLUE)Accessing nginx container...$(RESET)"; \
		docker exec -it transcendence-prod-nginx-1 /bin/bash -c "cd /var/www/html && ls -la"; \
	else \
		echo "$(RED)Nginx container is not running!$(RESET)"; \
	fi

web:
	@if [ -n "$$(docker ps -q -f name=web)" ]; then \
		echo "$(BLUE)Accessing web container...$(RESET)"; \
		docker exec -it web /bin/bash -c "ls -la"; \
	else \
		echo "$(RED)Web container is not running!$(RESET)"; \
	fi

data:
	@echo "$(BLUE)Common database commands:$(RESET)"
	@echo "psql -U [username] -d [database]"
	@echo "docker exec -it [container-id] psql -U [username] -d [database]"
	@echo "SELECT * FROM [table_name];"
	@echo "SELECT username, password FROM user_user;"

dock:
	@echo "$(BLUE)Common Docker commands:$(RESET)"
	@echo "docker exec -it [container-id] /bin/bash"
	@echo "curl http://localhost:8443/metrics"
	@echo "docker exec -it [container-id] sh"

script:
	chmod +x get_logs.sh

.PHONY: all down supp data re logs dock script db nginx web check-env
