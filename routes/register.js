// 必要なもの読み込み
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dbConfig = require('../db/config');

// JSONボディをパースするためのミドルウェア
router.use(express.json());

// ユーザー登録用のルート
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // パスワードのハッシュ化(ソルトラウンド10)
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // データベース接続
    const connection = await mysql.createConnection(dbConfig);

    // ユーザー情報を挿入
    const [result] = await connection.execute(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email]
    );

    // 挿入成功時の処理
    res.status(201).json({ message: "ユーザー登録が成功しました。" });

    // 接続終了
    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ユーザー登録に失敗しました。" });
  }
});


const registerRouter = router;
// モジュールとしてエクスポート
module.exports = registerRouter;
