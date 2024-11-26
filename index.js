import express from 'express';

const app = express()

const PORT = 3000

// import express from 'express';

// const app = express();

app.get('/libros',(req,res)=> res.send('Obteniendo libros'));
app.post('/libros',(req,res)=> res.send('Creando nuevos libros'));
app.put('/libros',(req,res)=> res.send('Actualizando libros'));
app.delete('/libros',(req,res)=> res.send('Eliminando libros'))

app.listen(PORT)
console.log("Estás escuchando en el puerto 3000");