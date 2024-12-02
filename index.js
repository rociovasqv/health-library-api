import express from 'express';
import connectDB from './config/db.js';
import libroRoutes from './routes/libroRoutes.js'

const app = express();

const PORT = 4000

//Middleware
app.use(express.json());

// Endpoint raíz (Ruta base)
app.get('/', (req, res) => {
    res.send({ message: 'Bienvenido a la API de Libros' });
});

//Rutas
app.use("/", libroRoutes);

//Iniciar el servidor y la conexión con la base de datos
const iniciarServidor = async () => {
    try {
        // Establecer conexión con la base de datos
        const dbConnection = await connectDB();
        console.log('Conexión a la base de datos establecida con éxito.');

        app.set('db', dbConnection); // Inyectar conexión a la app

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Escuchando en el puerto ${PORT}. Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); // Salir del proceso si la conexión falla
    }
};
iniciarServidor();
