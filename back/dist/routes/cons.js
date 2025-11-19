var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { pool } from '../data/db.js';
const routercons = express.Router(); // Cria um roteador do Express para organizar as rotas
// -----------------------------
// Consulta Produtos
// -----------------------------
routercons.get("/produto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tipo, id } = req.query; // Recebe parâmetros da URL (tipo e id)
    // Validação básica
    if (!tipo || !id) {
        return res.status(400).json({ error: "Parâmetros inválidos." });
    }
    // Mapeia o tipo para a tabela correspondente no banco
    const tabela = {
        pizza: "pizzas",
        bebida: "bebidas",
        sobremesa: "sobremesas",
        adicional: "adicionais"
    }[tipo];
    if (!tabela) {
        return res.status(400).json({ error: "Tipo inválido." });
    }
    try {
        // Consulta o produto pelo ID
        const result = yield pool.query(`SELECT * FROM ${tabela} WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado." });
        }
        return res.json({ produto: result.rows[0] }); // Retorna o produto encontrado
    }
    catch (err) {
        console.error("Erro ao consultar produto:", err);
        return res.status(500).json({ error: "Erro ao consultar produto." });
    }
}));
// -----------------------------
// Consultar Clientes
// -----------------------------
routercons.get("/clientes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, cpf, nome } = req.query;
    let query = "SELECT * FROM clientes"; // Query base
    const conditions = []; // Condições dinâmicas
    const values = []; // Valores para substituição segura
    // Adiciona condições conforme parâmetros recebidos
    if (id) {
        conditions.push("id = $1");
        values.push(id);
    }
    if (cpf) {
        conditions.push(`cpf = $${values.length + 1}`);
        values.push(cpf);
    }
    if (nome) {
        conditions.push(`LOWER(nome) LIKE LOWER($${values.length + 1})`);
        values.push(`%${nome}%`);
    }
    // Se houver condições, adiciona ao SQL
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    try {
        const result = yield pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Cliente não encontrado." });
        }
        return res.json({ clientes: result.rows }); // Retorna lista de clientes
    }
    catch (err) {
        console.error("Erro ao consultar cliente:", err);
        return res.status(500).json({ error: "Erro ao consultar cliente." });
    }
}));
// -----------------------------
// Histórico de Compras
// -----------------------------
routercons.get("/historico-compras", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpf, dataInicio, dataFim } = req.query;
    // Validação
    if (!cpf || !dataInicio || !dataFim) {
        return res.status(400).json({ error: "CPF, data inicial e data final são obrigatórios." });
    }
    try {
        // Busca pedidos do cliente no período
        const result = yield pool.query(`SELECT * FROM pedidos
       WHERE cpf = $1
       AND data_pedido BETWEEN $2 AND $3
       ORDER BY data_pedido DESC`, [cpf, dataInicio, `${dataFim} 23:59:59`] // inclui o dia final completo
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Nenhuma compra encontrada nesse período." });
        }
        return res.json({ pedidos: result.rows });
    }
    catch (err) {
        console.error("Erro ao buscar histórico de compras:", err);
        return res.status(500).json({ error: "Erro ao buscar histórico de compras." });
    }
}));
// -----------------------------
// Histórico de Produtos vendidos
// -----------------------------
routercons.get("/historico-produto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tipo = String(req.query.tipo);
    const nome = String(req.query.nome);
    const dataInicio = String(req.query.dataInicio);
    const dataFim = String(req.query.dataFim);
    // Mapeia tipo para colunas específicas
    const mapa = {
        "1": { nome: "pizza", quantidade: "quantidade_pizza" },
        "2": { nome: "bebida", quantidade: "quantidade_bebida" },
        "3": { nome: "sobremesa", quantidade: "quantidade_sobremesa" },
        "4": { nome: "adicional", quantidade: "quantidade_adicional" },
    };
    const colunas = mapa[tipo];
    if (!colunas)
        return res.status(400).json({ error: "Tipo inválido." });
    try {
        // Busca vendas do produto no período
        const result = yield pool.query(`SELECT ${colunas.quantidade} AS quantidade, data_pedido
       FROM pedidos
       WHERE ${colunas.nome} = $1
       AND data_pedido BETWEEN $2 AND $3
       ORDER BY data_pedido`, [nome, dataInicio, `${dataFim} 23:59:59`]);
        return res.json({
            produto: nome,
            tipo: colunas.nome,
            vendas: result.rows,
        });
    }
    catch (err) {
        console.error("Erro:", err);
        return res.status(500).json({ error: "Erro ao buscar vendas." });
    }
}));
// -----------------------------
// Verificar se cliente existe pelo CPF
// -----------------------------
routercons.get("/verificar-cliente/:cpf", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpf } = req.params;
    if (!cpf) {
        return res.status(400).json({ error: "CPF é obrigatório." });
    }
    try {
        const result = yield pool.query("SELECT 1 FROM clientes WHERE cpf = $1 LIMIT 1", [cpf]);
        if (result.rows.length > 0) {
            return res.json({ existe: true }); // Cliente existe
        }
        else {
            return res.json({ existe: false }); // Cliente não existe
        }
    }
    catch (err) {
        console.error("Erro ao verificar CPF:", err);
        return res.status(500).json({ error: "Erro ao verificar CPF." });
    }
}));
// -----------------------------
// Produto mais vendido no período
// -----------------------------
routercons.get("/mais-vendido", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tipo = String(req.query.tipo);
    const dataInicio = String(req.query.dataInicio);
    const dataFim = String(req.query.dataFim);
    // Mapeia colunas por categoria
    const mapa = {
        "1": { nome: "pizza", quantidade: "quantidade_pizza", titulo: "Pizzas" },
        "2": { nome: "bebida", quantidade: "quantidade_bebida", titulo: "Bebidas" },
        "3": { nome: "sobremesa", quantidade: "quantidade_sobremesa", titulo: "Sobremesas" },
        "4": { nome: "adicional", quantidade: "quantidade_adicional", titulo: "Adicionais" },
    };
    const colunas = mapa[tipo];
    if (!colunas)
        return res.status(400).json({ error: "Tipo inválido." });
    if (!dataInicio || !dataFim)
        return res.status(400).json({ error: "Período inválido." });
    try {
        // Consulta agregada para encontrar o mais vendido
        const result = yield pool.query(`SELECT ${colunas.nome} AS produto,
              SUM(${colunas.quantidade}) AS total_unidades,
              COUNT(*) AS pedidos,
              MIN(data_pedido) AS primeira_venda,
              MAX(data_pedido) AS ultima_venda
       FROM pedidos
       WHERE data_pedido BETWEEN $1 AND $2
       GROUP BY ${colunas.nome}
       ORDER BY total_unidades DESC
       LIMIT 1`, [dataInicio, `${dataFim} 23:59:59`]);
        if (result.rows.length === 0) {
            return res.json({ error: "Nenhuma venda encontrada nesse período." });
        }
        return res.json({
            categoria: colunas.titulo,
            maisVendido: result.rows[0],
        });
    }
    catch (err) {
        console.error("Erro:", err);
        return res.status(500).json({ error: "Erro ao buscar vendas." });
    }
}));
export default routercons; // Exporta o roteador para ser usado no servidor principal
//# sourceMappingURL=cons.js.map