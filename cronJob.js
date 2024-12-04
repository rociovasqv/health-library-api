import cron from "node-cron";
import connectDB from "./config/db.js";

const db = connectDB();

const cronJob = async () =>
{
    cron.schedule('0 0 * * *', async () => { // Se ejecuta diariamente a la medianoche
        try {
            const query = `
                UPDATE Prestamo
                SET estado = 'atrasado'
                WHERE estado = 'activo' AND fecha_devolucion < NOW()
            `;
            await db.query(query);
            console.log("Préstamos atrasados actualizados.");
        } catch (error) {
            console.error("Error al actualizar préstamos atrasados:", error);
        }
    }); 
}

export default cronJob;
