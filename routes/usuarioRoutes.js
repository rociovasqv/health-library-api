import express from 'express';
import usuarioControllers from '../controllers/usuarioControllers.js';

const router = express.Router()

router.get('/usuarios', usuarioControllers.listarUsuario);
router.post('/usuarios', usuarioControllers.registrarUsuario);
router.get('/usuarios/:id', usuarioControllers.getUsuario);
router.put('/usuarios/:id', usuarioControllers.editUsuario);
router.delete('/usuarios/:id', usuarioControllers.eliminarUsuario)

export default router;