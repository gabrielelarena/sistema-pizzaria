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
import { pool } from './db.js';
const router = express.Router();
//
// 📦 ROTA: Enviar pedido
//
router.post('/enviar-pedido', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cliente, pedidos } = req.body;
    console.log("Recebido do frontend:", { cliente, pedidos });
    try {
        const clienteResult = yield pool.query(`INSERT INTO clientes (cpf, nome, telefone, endereco)
       VALUES ($1, $2, $3, $4) RETURNING id`, [cliente.cpf, cliente.nome, cliente.telefone, cliente.endereco]);
        const clienteId = clienteResult.rows[0].id;
        for (const p of pedidos) {
            yield pool.query(`INSERT INTO pedidos (
          cliente_id, cpf, data_pedido, pizza, quantidade_pizza, tamanho,
          bebida, quantidade_bebida, sobremesa, quantidade_sobremesa,
          observacoes, forma_pagamento, preco_total, cupom
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14
        )`, [
                clienteId,
                p.cpf,
                p.data_pedido,
                p.pizza,
                p.quantidade_pizza,
                p.tamanho,
                p.bebida,
                p.quantidade_bebida,
                p.sobremesa,
                p.quantidade_sobremesa,
                p.observacoes,
                p.forma_pagamento,
                p.preco_total,
                p.cupom,
            ]);
        }
        return res.status(200).json({ message: 'Pedido armazenado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao salvar pedido:', error);
        return res.status(500).json({ error: 'Erro ao salvar pedido.' });
    }
}));
// Cadastrar pizza (nome, tamanho e preco obrigatórios)
router.post('/pizzas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, tamanho, preco } = req.body;
    if (!nome || !tamanho || preco === undefined || preco === null || isNaN(preco)) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome, tamanho e preço.' });
    }
    try {
        const existe = yield pool.query('SELECT * FROM pizzas WHERE nome = $1 AND tamanho = $2', [nome, tamanho]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Essa pizza já existe com esse tamanho.' });
        }
        yield pool.query('INSERT INTO pizzas (nome, tamanho, preco) VALUES ($1, $2, $3)', [nome, tamanho, preco]);
        return res.status(201).json({ message: 'Pizza cadastrada com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao cadastrar pizza:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar pizza.' });
    }
}));
// Atualizar pizza (id obrigatório, campos opcionais)
router.put('/pizzas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    const { nome, tamanho, preco } = req.body;
    if (isNaN(idNum) || idNum <= 0) {
        return res.status(400).json({ error: 'ID inválido para atualização.' });
    }
    const campos = [];
    const valores = [];
    if (nome) {
        campos.push(`nome = $${valores.length + 1}`);
        valores.push(nome);
    }
    if (tamanho && tamanho !== "Selecione um tamanho:") {
        campos.push(`tamanho = $${valores.length + 1}`);
        valores.push(tamanho);
    }
    if (preco !== undefined && preco !== null && !isNaN(preco)) {
        campos.push(`preco = $${valores.length + 1}`);
        valores.push(preco);
    }
    if (campos.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
    }
    valores.push(idNum);
    const query = `UPDATE pizzas SET ${campos.join(', ')} WHERE id = $${valores.length}`;
    try {
        yield pool.query(query, valores);
        return res.json({ message: 'Pizza atualizada com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao atualizar pizza:', err);
        return res.status(500).json({ error: 'Erro ao atualizar pizza.' });
    }
}));
// Excluir pizza (somente ID necessário)
router.delete('/pizzas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum) || idNum <= 0) {
        return res.status(400).json({ error: 'ID inválido para exclusão.' });
    }
    try {
        yield pool.query('DELETE FROM pizzas WHERE id = $1', [idNum]);
        return res.json({ message: 'Pizza excluída com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao excluir pizza:', err);
        return res.status(500).json({ error: 'Erro ao excluir pizza.' });
    }
}));
// 🧃 ROTAS: Bebidas
router.post('/bebidas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, preco } = req.body;
    if (!nome || preco === undefined || preco === null || isNaN(preco)) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome e preço.' });
    }
    try {
        const existe = yield pool.query('SELECT * FROM bebidas WHERE nome = $1', [nome]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Essa bebida já está cadastrada.' });
        }
        yield pool.query('INSERT INTO bebidas (nome, preco) VALUES ($1, $2)', [nome, preco]);
        return res.status(201).json({ message: 'Bebida cadastrada com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao cadastrar bebida:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar bebida.' });
    }
}));
router.put('/bebidas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    const { nome, preco } = req.body;
    if (isNaN(idNum) || idNum <= 0) {
        return res.status(400).json({ error: 'ID inválido para atualização.' });
    }
    const campos = [];
    const valores = [];
    if (nome) {
        campos.push(`nome = $${valores.length + 1}`);
        valores.push(nome);
    }
    if (preco !== undefined && preco !== null && !isNaN(preco)) {
        campos.push(`preco = $${valores.length + 1}`);
        valores.push(preco);
    }
    if (campos.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
    }
    valores.push(idNum);
    const query = `UPDATE bebidas SET ${campos.join(', ')} WHERE id = $${valores.length}`;
    try {
        yield pool.query(query, valores);
        return res.json({ message: 'Bebida atualizada com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao atualizar bebida:', err);
        return res.status(500).json({ error: 'Erro ao atualizar bebida.' });
    }
}));
router.delete('/bebidas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum) || idNum <= 0) {
        return res.status(400).json({ error: 'ID inválido para exclusão.' });
    }
    try {
        yield pool.query('DELETE FROM bebidas WHERE id = $1', [idNum]);
        return res.json({ message: 'Bebida excluída com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao excluir bebida:', err);
        return res.status(500).json({ error: 'Erro ao excluir bebida.' });
    }
}));
// ROTAS: Sobremesas
router.post('/sobremesas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, preco } = req.body;
    if (!nome || preco === undefined || preco === null || isNaN(preco)) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome e preço.' });
    }
    try {
        const existe = yield pool.query('SELECT * FROM sobremesas WHERE nome = $1', [nome]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Essa sobremesa já está cadastrada.' });
        }
        yield pool.query('INSERT INTO sobremesas (nome, preco) VALUES ($1, $2)', [nome, preco]);
        return res.status(201).json({ message: 'Sobremesa cadastrada com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao cadastrar sobremesa:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar sobremesa.' });
    }
}));
router.put('/sobremesas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    const { nome, preco } = req.body;
    if (isNaN(idNum) || idNum <= 0) {
        return res.status(400).json({ error: 'ID inválido para atualização.' });
    }
    const campos = [];
    const valores = [];
    if (nome) {
        campos.push(`nome = $${valores.length + 1}`);
        valores.push(nome);
    }
    if (preco !== undefined && preco !== null && !isNaN(preco)) {
        campos.push(`preco = $${valores.length + 1}`);
        valores.push(preco);
    }
    if (campos.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
    }
    valores.push(idNum);
    const query = `UPDATE sobremesas SET ${campos.join(', ')} WHERE id = $${valores.length}`;
    try {
        yield pool.query(query, valores);
        return res.json({ message: 'Sobremesa atualizada com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao atualizar sobremesa:', err);
        return res.status(500).json({ error: 'Erro ao atualizar sobremesa.' });
    }
}));
router.delete('/sobremesas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum) || idNum <= 0) {
        return res.status(400).json({ error: 'ID inválido para exclusão.' });
    }
    try {
        yield pool.query('DELETE FROM sobremesas WHERE id = $1', [idNum]);
        return res.json({ message: 'Sobremesa excluída com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao excluir sobremesa:', err);
        return res.status(500).json({ error: 'Erro ao excluir sobremesa.' });
    }
}));
export default router;
//# sourceMappingURL=routes.js.map