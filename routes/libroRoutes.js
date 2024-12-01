import express from 'express';
import libroControllers from '../controllers/libroControllers.js';

const router = express.Router()

router.get('/libros', libroControllers.listarLibros);
router.post('/libros',libroControllers.registrarLibro);
router.put('/libros/:id',(req,res)=> libroControllers.editarLibro);
router.delete('/libros/:id',(req,res)=> libroControllers.eliminarLibro)

export default router;