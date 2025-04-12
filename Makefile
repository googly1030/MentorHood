# Define variables
DOCKER_COMPOSE_PROD=docker compose -f docker-compose.prod.yml
DOCKER_COMPOSE_LOCAL=docker compose -f docker-compose.yml


# LIVE Commands
.PHONY: stop
stop:
	sudo $(DOCKER_COMPOSE_PROD) down

.PHONY: live
live:
	sudo $(DOCKER_COMPOSE_PROD) up -d --build

# LOCAL Commands
.PHONY: stop-local
stop-local:
	$(DOCKER_COMPOSE_LOCAL) down

.PHONY: start-local
start-local:
	$(DOCKER_COMPOSE_LOCAL) up --build