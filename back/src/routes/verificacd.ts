import express from 'express';
import { pool } from '../data/db.js';

const routerverif = express.Router();

routerverif.post('/verificar', async (req, res) => {
  const { cpf, nome, telefone, endereco } = req.body;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF é obrigatório.' });
  }

  try {
    const result = await pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Você não tem cadastro, clique em se cadastrar.' });
    }

    const clienteBanco = result.rows[0];
    const enderecoFinal = endereco?.trim() || "Retirar no local";

    if (
      clienteBanco.nome === nome &&
      clienteBanco.telefone === telefone &&
      clienteBanco.endereco === enderecoFinal
    ) {
      return res.json({ message: 'Ok, cadastro existente!' });
    } else {
      return res.json({
        message: 'Cadastro existe, mas algumas informações não batem.',
        clienteBanco
      });
    }
  } catch (err) {
    console.error('Erro ao verificar cadastro:', err);
    return res.status(500).json({ error: 'Erro ao verificar cadastro.' });
  }
});

routerverif.get('/usar-cadastro/:cpf', async (req, res) => {
  const { cpf } = req.params;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF inválido.' });
  }

  try {
    const result = await pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    return res.json({ cliente: result.rows[0] });
  } catch (err) {
    console.error('Erro ao buscar cadastro:', err);
    return res.status(500).json({ error: 'Erro ao buscar cadastro.' });
  }
});

export default routerverif;
