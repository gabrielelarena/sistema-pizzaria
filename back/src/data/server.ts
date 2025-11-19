// Importa dependências do servidor
import express from 'express'; // Framework para criar API
import cors from 'cors'; // Middleware para permitir requisições de diferentes origens

// Importa os módulos de rotas
import router from '../routes/routes.js';        // Rotas principais
import routerprod from '../routes/produtos.js'; // Rotas relacionadas a produtos
import routhercons from '../routes/cons.js';    // Rotas de consultas
import routherpreco from '../routes/precos.js'; // Rotas de preços
import routherverif from '../routes/verificacd.js'; // Rotas de verificação de cadastro

// Cria a aplicação Express
const app = express();
const port = 3000; // Porta onde o servidor vai rodar

// Middlewares
app.use(cors()); // Permite requisições de diferentes origens (CORS)
app.use(express.json()); // Permite trabalhar com JSON no corpo das requisições

// Usa as rotas importadas
app.use(router);
app.use(routerprod);
app.use(routhercons);
app.use(routherpreco);
app.use(routherverif);

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});