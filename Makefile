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

dev-migrate:
	$(DOCKER_COMMAND_DEV) exec web python manage.py makemigrations game
	$(DOCKER_COMMAND_DEV) exec web python manage.py migrate

.PHONY: dev dev-down dev-migrate


## production
######################
ENV_PROD = ./.env.prod
COMPOSE_PROD = ./compose-prod.yaml
NAME_PROD = transcendence-prod
DOCKER_COMMAND_PROD = docker compose -f $(COMPOSE_PROD) --env-file $(ENV_PROD) -p $(NAME_PROD)

all:
	$(DOCKER_COMMAND_PROD) up -d

down:
	$(DOCKER_COMMAND_PROD) down

.PHONY: all down
