all:
	docker compose up -d --build

stop:
	docker compose down

pg:
	docker compose exec db psql -U django transcendence

re: stop all

.PHONY: all stop re pg
