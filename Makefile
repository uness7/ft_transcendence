all:
	docker compose up -d --build

stop:
	docker compose down

pg:
	docker compose exec db psql -U django transcendence

migrate:
	docker compose exec web python manage.py makemigrations rest
	docker compose exec web python manage.py migrate

re: stop all

.PHONY: all stop re pg
