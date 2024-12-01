import mysql from 'mysql2/promise'


const connectDB = async () =>
{
  const pool = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'biblioteca_med',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  return pool
}

export default connectDB;