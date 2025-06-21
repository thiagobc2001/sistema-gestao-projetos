import express from 'express';
import pool from '../models/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM projetos');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { nome, descricao, status, usuario_id } = req.body;
  const result = await pool.query(
    'INSERT INTO projetos (nome, descricao, status, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [nome, descricao, status, usuario_id]
  );
  res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, status } = req.body;
  const result = await pool.query(
    'UPDATE projetos SET nome=$1, descricao=$2, status=$3 WHERE id=$4 RETURNING *',
    [nome, descricao, status, id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM projetos WHERE id = $1', [id]);
  res.json({ message: 'Projeto excluído' });
});

// Rota para gerar texto WhatsApp
router.get('/compartilhar/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM projetos WHERE id = $1', [id]);
  if (result.rows.length > 0) {
    const p = result.rows[0];
    const texto = `Projeto: ${p.nome}\nDescrição: ${p.descricao}\nStatus: ${p.status}`;
    res.json({ texto });
  } else {
    res.status(404).json({ error: 'Projeto não encontrado' });
  }
});

export default router;
