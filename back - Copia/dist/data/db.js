import { Pool } from 'pg';
export const pool = new Pool({
    user: 'pizzaria',
    host: 'localhost',
    database: 'db_pizzaria',
    password: '102030',
    port: 5432,
});
//# sourceMappingURL=db.js.map