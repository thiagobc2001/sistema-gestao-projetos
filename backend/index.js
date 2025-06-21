import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usuarioRoutes from './routes/usuarios.js';
import projetoRoutes from './routes/projetos.js';
import etapaRoutes from './routes/etapas.js';
import tarefaRoutes from './routes/tarefas.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/usuarios', usuarioRoutes);
app.use('/projetos', projetoRoutes);
app.use('/etapas', etapaRoutes);
app.use('/tarefas', tarefaRoutes);

// Teste API
app.get('/', (req, res) => {
  res.send('API rodando 🔥');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
