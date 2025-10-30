"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const router = express_1.default.Router();
router.post('/enviar-pedido', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cliente, pedidos } = req.body;
    console.log("Recebido do frontend:", { cliente, pedidos });
    try {
        const result = yield db_1.pool.query(`INSERT INTO clientes (cpf, nome, telefone, endereco, pagamento)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`, [cliente.cpf, cliente.nome, cliente.telefone, cliente.endereco, cliente.pagamento]);
        const clienteId = result.rows[0].id;
        for (const p of pedidos) {
            console.log("Pedido recebido:", JSON.stringify(p, null, 2));
            console.log("Data recebida:", p.data_pedido);
            console.log("Tipo da data no backend:", typeof p.data_pedido, p.data_pedido);
            console.log("Valores enviados:", [
                clienteId,
                cliente.cpf,
                p.pizza,
                p.tamanho,
                p.quantidadePizza,
                p.bebida,
                p.quantidadeBebida,
                p.data_pedido
            ]);
            yield db_1.pool.query(`INSERT INTO pedidos (
    cliente_id, cpf, pizza, tamanho, quantidade_pizza, bebida, quantidade_bebida, data_pedido
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
                clienteId,
                cliente.cpf,
                p.pizza,
                p.tamanho,
                p.quantidadePizza,
                p.bebida,
                p.quantidadeBebida,
                p.data_pedido // já vem como 'YYYY-MM-DD'
            ]);
        }
        res.status(200).json({ message: 'Pedido armazenado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao salvar pedido:', error);
        res.status(500).json({ error: 'Erro ao salvar pedido.' });
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map