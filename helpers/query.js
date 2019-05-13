const mysql = require('mysql');


exports.dbConfig = {
    connectionLimit : 5,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'simple-db'
};


const pool = mysql.createPool(dbConfig);

exports.query = function(queryString, params) {
    if (!params) params = [];

    return new Promise(function(resolve, reject) {
        pool.query(queryString, params, function (error, results, fields) {
            if (error) { reject (error) }
            else { resolve(results) }
        });
    });
}
