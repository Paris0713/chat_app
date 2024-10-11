// モジュールの読み込み
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const dbConfig = require("../db/config");

const signinRouter = router; 

// POSTメソッドのルーティング
router.post("/", async (req, res) => {
  // リクエストボディの取得
  const { username, password } = req.body;

  // データベースへの接続とクエリ実行
  try {
    const connection = await mysql.createConnection(dbConfig);
    // ユーザー名でユーザー情報を検索
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // 検索結果が1件以上あれば、ユーザーが存在する
    if (rows.length > 0) {
      const user = rows[0];

      // パスワードの照合(ハッシュ化されたのと比較)
      if (await bcrypt.compare(password, user.password)) {
        // 認証が成功すれば、セッションにユーザーIDを保存し、JSONレスポンスを返す
        req.session.userId = user.id;
        console.log("認証成功、セッションID:", req.session.userId);
        res.json({
          success: true,
          message: "サインイン成功",
          redirectUrl: "/myroom",
        });
      } else {
        res.status(401).json({ message: "パスワードが間違っています" });
      }
    } else {
      res.status(401).json({ message: "ユーザーが見つかりません" });
    }

    await connection.end();
  } catch (error) {
    console.error("サインイン中のエラー:", error);
    res.status(500).json({ error: "サインインに失敗しました" });
  }
});

module.exports = signinRouter;
