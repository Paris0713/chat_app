// mysgl2 読み込み
const mysql = require('mysql2');
// db情報の読み込み
const dbConfig = require('./config');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('データベース接続エラー:', err);
        return;
    }
    console.log('データベースに接続中...');
});

module.exports = connection;
