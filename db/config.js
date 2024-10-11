require('dotenv').config();


// データベース情報
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};


// モジュールとしてエクスポート
module.exports = dbConfig;