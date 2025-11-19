var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import express from 'express';
import { pool } from '../data/db.js';
import bcrypt from 'bcrypt';
const routerverif = express.Router();
routerverif.post('/verificar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpf, senha } = req.body;
    if (!cpf || !senha) {
        return res.status(400).json({ error: 'CPF e senha são obrigatórios.' });
    }
    try {
        const result = yield pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Você não tem cadastro, clique em se cadastrar.' });
        }
        const clienteBanco = result.rows[0];
        // 🔑 compara senha digitada com hash do banco
        const senhaValida = yield bcrypt.compare(senha, clienteBanco.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta. Verifique CPF e senha.' });
        }
        return res.json({
            message: 'Ok, cadastro existente!',
            clienteBanco: {
                nome: clienteBanco.nome,
                telefone: clienteBanco.telefone,
                endereco: clienteBanco.endereco
            }
        });
    }
    catch (err) {
        console.error('Erro ao verificar cadastro:', err);
        return res.status(500).json({ error: 'Erro ao verificar cadastro.' });
    }
}));
// GET /verificar-cliente/:cpf
routerverif.get('/verificar-cliente/:cpf', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpf } = req.params;
    try {
        const clienteResult = yield pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);
        if (clienteResult.rows.length === 0) {
            // não existe cliente → cupom válido
            return res.json({ existe: false, temPedido: false });
        }
        const pedidosResult = yield pool.query('SELECT * FROM pedidos WHERE cpf = $1', [cpf]);
        const temPedido = pedidosResult.rows.length > 0;
        return res.json({ existe: true, temPedido });
    }
    catch (err) {
        console.error('Erro ao verificar cliente/pedido:', err);
        return res.status(500).json({ error: 'Erro ao verificar cliente/pedido.' });
    }
}));
routerverif.get('/usar-cadastro/:cpf', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpf } = req.params;
    if (!cpf) {
        return res.status(400).json({ error: 'CPF inválido.' });
    }
    try {
        const result = yield pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        // ⚠️ nunca retorne a senha para o cliente
        const _a = result.rows[0], { senha } = _a, clienteSemSenha = __rest(_a, ["senha"]);
        return res.json({ cliente: clienteSemSenha });
    }
    catch (err) {
        console.error('Erro ao buscar cadastro:', err);
        return res.status(500).json({ error: 'Erro ao buscar cadastro.' });
    }
}));
export default routerverif;
//# sourceMappingURL=verificacd.js.map