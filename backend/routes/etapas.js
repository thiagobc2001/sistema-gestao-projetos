import express from 'express';
import pool from '../models/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM etapas');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { nome, descricao, ordem, projeto_id } = req.body;
  const result = await pool.query(
    'INSERT INTO etapas (nome, descricao, ordem, projeto_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [nome, descricao, ordem, projeto_id]
  );
  res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, ordem } = req.body;
  const result = await pool.query(
    'UPDATE etapas SET nome=$1, descricao=$2, ordem=$3 WHERE id=$4 RETURNING *',
    [nome, descricao, ordem, id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM etapas WHERE id = $1', [id]);
  res.json({ message: 'Etapa excluída' });
});

export default router;
