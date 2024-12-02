import express from 'express';
import libroControllers from '../controllers/libroControllers.js';

const router = express.Router()

router.get('/libros', libroControllers.listarLibros);
router.post('/libros',libroControllers.registrarLibro);
router.get('/libros/editar/:id', libroControllers.getLibro)
router.get('/libros/:id', libroControllers.buscarLibro)
router.put('/libros/:id',libroControllers.editarLibro);
router.delete('/libros/:id',libroControllers.eliminarLibro)

export default router;