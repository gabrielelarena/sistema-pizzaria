1. 📦 Estrutura do Projeto
bash
simulado-cli/
├── src/
│   ├── index.ts
│   ├── db.ts
│   └── quiz.ts
├── .env
├── docker-compose.yml
├── package.json
├── tsconfig.json
2. 🐳 Docker + PostgreSQL + pgAdmin
docker-compose.yml:

yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: simulado
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  pgdata:
3. 🧾 Banco de Dados
Crie a tabela no PostgreSQL:

sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  answer INTEGER NOT NULL
);
Exemplo de inserção:

sql
INSERT INTO questions (question, options, answer)
VALUES ('Qual a capital do Brasil?', ARRAY['São Paulo', 'Brasília', 'Rio de Janeiro', 'Salvador'], 1);
4. 📦 Instalações
bash
npm init -y
npm install typescript ts-node @types/node pg dotenv readline-sync
npx tsc --init
5. 🔐 .env
Código
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=simulado
6. 🔌 Conexão com o Banco (src/db.ts)
ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
7. 🎯 Lógica do Simulado (src/quiz.ts)
ts
import { pool } from './db';
import readlineSync from 'readline-sync';

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

export async function runQuiz() {
  const res = await pool.query('SELECT * FROM questions');
  const questions: Question[] = res.rows;

  let correct = 0;

  for (const q of questions) {
    console.log(`\n${q.question}`);
    q.options.forEach((opt, i) => {
      console.log(`${i + 1}. ${opt}`);
    });

    const userAnswer = readlineSync.questionInt('Sua resposta (número): ') - 1;

    if (userAnswer === q.answer) {
      console.log('✅ Correto!');
      correct++;
    } else {
      console.log(`❌ Errado! Resposta correta: ${q.options[q.answer]}`);
    }
  }

  console.log(`\n🎉 Você acertou ${correct} de ${questions.length} perguntas.`);
}
8. 🚀 Entrada Principal (src/index.ts)
ts
import { runQuiz } from './quiz';

runQuiz().then(() => process.exit());
✅ Execução
Suba o banco com Docker:

bash
docker-compose up -d
Compile e execute:

bash
npx ts-node src/index.ts
