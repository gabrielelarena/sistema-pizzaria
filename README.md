version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: meu_banco
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: senha123
      POSTGRES_DB: minha_base
    ports:
      - "5432:5432"
    volumes:
      - ./data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: meu_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: senha123
    ports:
      - "8080:80"
    depends_on:
      - postgres
