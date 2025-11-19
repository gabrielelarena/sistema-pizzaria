// Importa o módulo Pool do pacote 'pg' (PostgreSQL)
import { Pool } from 'pg';
// Cria uma conexão com o banco de dados PostgreSQL
export const pool = new Pool({
    user: 'pizzaria', // Usuário do banco
    host: 'localhost', // Servidor do banco
    database: 'db_pizzaria', // Nome do banco de dados
    password: '102030', // Senha do usuário
    port: 5432, // Porta padrão do PostgreSQL
});
//# sourceMappingURL=db.js.map