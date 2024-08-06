all:
	docker compose up -d

stop:
	docker compose down

clean: stop
	docker image rm ft_transcendence-web

re: stop all

.PHONY: all stop clean re
