version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: sistema-post
    environment:
      POSTGRES_USER: pizzaria
      POSTGRES_PASSWORD: 102030
      POSTGRES_DB: db_pizzaria
    ports:
      - "5432:5432"
    volumes:
      - ./data:/var/lib/postgresql/18/docker

  pgadmin:
    image: dpage/pgadmin4
    container_name: meu-postgres
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: 102030
    ports:
      - "8080:80"
    depends_on:
      - postgres
