const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      
  password: 'root', 
  database: 'user_db'
});

module.exports = pool.promise();