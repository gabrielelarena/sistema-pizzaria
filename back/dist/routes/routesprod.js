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
const routerprod = express.Router();
// ROTAS: Pizza
routerprod.post('/pizzas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
routerprod.put('/pizzas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
routerprod.delete('/pizzas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// ROTAS: Bebidas
routerprod.post('/bebidas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
routerprod.put('/bebidas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
routerprod.delete('/bebidas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
routerprod.post('/sobremesas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
routerprod.put('/sobremesas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
routerprod.delete('/sobremesas/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// ROTAS: Adicionais
routerprod.post('/adicionais', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, preco } = req.body;
    if (!nome || preco === undefined || preco === null || isNaN(preco)) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome e preço.' });
    }
    try {
        const existe = yield pool.query('SELECT * FROM adicionais WHERE nome = $1', [nome]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Esse adicional já está cadastrado.' });
        }
        yield pool.query('INSERT INTO adicionais (nome, preco) VALUES ($1, $2)', [nome, preco]);
        return res.status(201).json({ message: 'Adicional cadastrado com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao cadastrar adicional:', err);
        return res.status(500).json({ error: 'Erro ao cadastrar adicional.' });
    }
}));
routerprod.put('/adicionais/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const query = `UPDATE adicionais SET ${campos.join(', ')} WHERE id = $${valores.length}`;
    try {
        yield pool.query(query, valores);
        return res.json({ message: 'Adicional atualizado com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao atualizar adicional:', err);
        return res.status(500).json({ error: 'Erro ao atualizar adicional.' });
    }
}));
routerprod.delete('/adicionais/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNum = parseInt(id);
    if (isNaN(idNum) || idNum <= 0) {
        return res.status(400).json({ error: 'ID inválido para exclusão.' });
    }
    try {
        yield pool.query('DELETE FROM adicionais WHERE id = $1', [idNum]);
        return res.json({ message: 'Adicional excluído com sucesso!' });
    }
    catch (err) {
        console.error('Erro ao excluir adicional:', err);
        return res.status(500).json({ error: 'Erro ao excluir adicional.' });
    }
}));
export default routerprod;
//# sourceMappingURL=routesprod.js.map