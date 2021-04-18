const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'user',
    password: 'password',
    multipleStatements: true,
    database: 'saboroso',
});

module.exports = connection;