import express from 'express';
import prestamoControllers from '../controllers/prestamoControllers.js';

const router = express.Router();

router.get('/prestamos', prestamoControllers.mostrarPrestamos)
router.post('/prestamos',prestamoControllers.crearPrestamo);
router.get('/prestamos/:id', prestamoControllers.getPrestamo);
router.put('/prestamos/editar/:id', prestamoControllers.editarPrestamo);
router.delete('/prestamos/:id', prestamoControllers.eliminarPrestamo);

export default router;