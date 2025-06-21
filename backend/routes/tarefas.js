import express from 'express';
import pool from '../models/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM tarefas');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { nome, descricao, concluida, ordem, etapa_id } = req.body;
  const result = await pool.query(
    'INSERT INTO tarefas (nome, descricao, concluida, ordem, etapa_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, descricao, concluida, ordem, etapa_id]
  );
  res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, concluida, ordem } = req.body;
  const result = await pool.query(
    'UPDATE tarefas SET nome=$1, descricao=$2, concluida=$3, ordem=$4 WHERE id=$5 RETURNING *',
    [nome, descricao, concluida, ordem, id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
  res.json({ message: 'Tarefa excluída' });
});

export default router;
