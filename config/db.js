import mysql from 'mysql2'

const connectDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'biblioteca_med',
  });

export default connectDB;