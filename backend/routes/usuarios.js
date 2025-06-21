import express from 'express';
import pool from '../models/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
      [email, senha]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

router.post('/registrar', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, senha, tipo]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao registrar usuário' });
  }
});

export default router;
