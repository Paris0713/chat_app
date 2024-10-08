const mysql = require('mysql');

// データベース情報
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'chat_app'
};

// createConnectionメソッドを使用してデータベース接続を作成
const connection = mysql.createConnection(dbConfig);

module.exports = dbConfig;