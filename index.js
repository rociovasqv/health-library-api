import express from 'express';
import connectDB from './config/db.js';
import libroRoutes from './routes/libroRoutes.js'

const app = express();

const PORT = 4000

app.use(express.json());

//Rutas
app.use("/", libroRoutes);


// Endpoint raíz
app.get("/", (req, res) => {
    console.log("Bienvenido");
    res.send({ message: "Welcome to my API" });
});

// Conexión a la base de datos
const connectionDB = async () =>
{
    try{
        await connectDB()
         console.log("Conexión a la base de datos establecida con éxito.");
        }
    catch(err){
        console.error("Error al conectar a la base de datos:", err.message);
        process.exit(1); // Detener el proceso si no se puede conectar
    }

};
connectionDB()

// Iniciar servidor
app.listen(PORT, () => {
    console.log("Escuchando en el puerto " + PORT);
});