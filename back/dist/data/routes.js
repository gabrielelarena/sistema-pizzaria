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
router.post('/enviar-pedido', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cliente, pedidos } = req.body;
    console.log("Recebido do frontend:", { cliente, pedidos });
    try {
        // Insere cliente
        const clienteResult = yield pool.query(`INSERT INTO clientes (cpf, nome, telefone, endereco)
       VALUES ($1, $2, $3, $4) RETURNING id`, [cliente.cpf, cliente.nome, cliente.telefone, cliente.endereco]);
        const clienteId = clienteResult.rows[0].id;
        // Insere pedidos
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
        res.status(200).json({ message: 'Pedido armazenado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao salvar pedido:', error);
        res.status(500).json({ error: 'Erro ao salvar pedido.' });
    }
}));
export default router;
//# sourceMappingURL=routes.js.map