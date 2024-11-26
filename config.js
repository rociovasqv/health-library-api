import mysql from 'mysql2'

const mysqlPool = mysql.createPool(
    {
        host:"localhost",
        user:'root',
        password:'1234',
        database:''
    }
)

module.exports = mysqlPool;