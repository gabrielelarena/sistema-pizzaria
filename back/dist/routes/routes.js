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
const router = express.Router();
// ROTA: Enviar pedido
router.post('/enviar-pedido', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { cliente, pedidos } = req.body;
    try {
        const enderecoFinal = ((_a = cliente.endereco) === null || _a === void 0 ? void 0 : _a.trim()) || "Retirar no local";
        const clienteResult = yield pool.query(`INSERT INTO clientes (cpf, nome, telefone, endereco)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (cpf) DO UPDATE
         SET nome = EXCLUDED.nome,
             telefone = EXCLUDED.telefone,
             endereco = EXCLUDED.endereco
       RETURNING id`, [cliente.cpf, cliente.nome, cliente.telefone, enderecoFinal]);
        const clienteId = clienteResult.rows[0].id;
        // Agora insere os pedidos
        for (const p of pedidos) {
            console.log("Inserindo pedido:", p);
            yield pool.query(`INSERT INTO pedidos (
          cliente_id, cpf, data_pedido, pizza, quantidade_pizza, tamanho,
          bebida, quantidade_bebida, sobremesa, quantidade_sobremesa,
          adicional, quantidade_adicional, observacoes, forma_pagamento, preco_total, cupom
        ) VALUES (
          $1, $2, TO_TIMESTAMP($3, 'DD/MM/YYYY - HH24:MI'), $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16
        )`, [
                clienteId,
                p.cpf,
                p.data_pedido, // precisa estar no formato certo!
                p.pizza,
                p.quantidade_pizza,
                p.tamanho,
                p.bebida,
                p.quantidade_bebida,
                p.sobremesa,
                p.quantidade_sobremesa,
                p.adicional,
                p.quantidade_adicional,
                p.observacoes,
                p.forma_pagamento,
                p.preco_total,
                p.cupom,
            ]);
        }
        return res.status(200).json({ message: 'Pedido armazenado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao salvar pedido:', error.message, error.stack);
        return res.status(500).json({ error: 'Erro ao salvar pedido.' });
    }
}));
// ROTA: Clientes
router.post('/clientes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpf, nome, telefone, endereco } = req.body;
    if (!cpf || !nome || !telefone) {
        return res.status(400).json({ error: 'CPF, nome e telefone são obrigatórios.' });
    }
    const enderecoFinal = (endereco === null || endereco === void 0 ? void 0 : endereco.trim()) || "Retirar no local";
    try {
        const existe = yield pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Cliente já cadastrado com este CPF.' });
        }
        yield pool.query('INSERT INTO clientes (cpf, nome, telefone, endereco) VALUES ($1, $2, $3, $4)', [cpf, nome, telefone, enderecoFinal]);
        return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao cadastrar cliente:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
    }
}));
router.put('/clientes/:cpf', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpf } = req.params;
    const { nome, telefone, endereco } = req.body;
    if (!cpf) {
        return res.status(400).json({ error: 'CPF inválido para atualização.' });
    }
    const campos = [];
    const valores = [];
    if (nome) {
        campos.push(`nome = $${valores.length + 1}`);
        valores.push(nome);
    }
    if (telefone) {
        campos.push(`telefone = $${valores.length + 1}`);
        valores.push(telefone);
    }
    if (endereco !== undefined) {
        const enderecoFinal = (endereco === null || endereco === void 0 ? void 0 : endereco.trim()) || "Retirar no local";
        campos.push(`endereco = $${valores.length + 1}`);
        valores.push(enderecoFinal);
    }
    if (campos.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
    }
    valores.push(cpf);
    const query = `UPDATE clientes SET ${campos.join(', ')} WHERE cpf = $${valores.length}`;
    try {
        yield pool.query(query, valores);
        return res.json({ message: 'Cliente atualizado com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao atualizar cliente:', err);
        return res.status(500).json({ error: 'Erro ao atualizar cliente.' });
    }
}));
router.delete('/clientes/:cpf', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpf } = req.params;
    if (!cpf) {
        return res.status(400).json({ error: 'CPF inválido para exclusão.' });
    }
    try {
        yield pool.query('DELETE FROM clientes WHERE cpf = $1', [cpf]);
        return res.json({ message: 'Cliente excluído com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao excluir cliente:', err);
        return res.status(500).json({ error: 'Erro ao excluir cliente.' });
    }
}));
export default router;
//# sourceMappingURL=routes.js.map