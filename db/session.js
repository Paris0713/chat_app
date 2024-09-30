// mysgl2 読み込み
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'chat_app'
});

connection.connect((err) => {
    if (err) {
        console.error('データベース接続エラー:', err);
        return;
    }
    console.log('データベースに接続中...');
});

module.exports = connecton;
