// 必要なもの読み込み
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dbConfig = require('../db/config');

// JSONボディをパースするためのミドルウェア
router.use(express.json());

// ユーザー登録用のルート
router.post('/', async (req, res) => {
  console.log('Register endpoint accessed');
  const { username, password, email } = req.body;
  console.log(req.body);

  // パスワードのハッシュ化(ソルトラウンド10)
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // データベース接続
    const connection = await mysql.createConnection(dbConfig);
    console.log('データベースに接続しました')

    // ユーザー情報を挿入
    const [result] = await connection.execute(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email]
    );
    
    // セッションにユーザーIDを設定
    req.session.userId = result.insertId;
    console.log("セッションID設定:", req.session.userId); 

    res.status(201).json({ message: "ユーザー登録が成功しました。" });

    // 接続終了
    await connection.end();
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: "ユーザー登録に失敗しました。" });
  }
});


const registerRouter = router;
// モジュールとしてエクスポート
module.exports = registerRouter;
