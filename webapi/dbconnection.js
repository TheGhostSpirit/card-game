let mysql = require('mysql');  
let connection = mysql.createPool({  
    host: 'localhost',  
    user: 'root',  
    password: '',  
    database: 'solitaire'  
});  
module.exports = connection; 
