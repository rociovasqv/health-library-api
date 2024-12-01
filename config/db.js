import mysql from 'mysql2/promise'

const connectDB = async () =>
{
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'biblioteca_med',
  });
  return connection
}

export default connectDB;