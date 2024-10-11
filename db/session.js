// 環境変数の読み込み
require("dotenv").config();

// 必要なもの 読み込み

// express-session: セッションを管理するためのミドルウェア
const session = require("express-session");
// express-mysql-session: MySQLをセッションストアとして利用するためのモジュール
const MySQLStore = require("express-mysql-session")(session);
// データベース設定
const dbConfig = require("./config");

// セッションストアの設定
const sessionStore = new MySQLStore({
  host: dbConfig.host,
  port: 3306,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});


// セッションミドルウェアの設定
const sessionMiddleware = session({
  // クッキーの名前を指定
  key: "session_cookie_name",
  // 環境変数から秘密鍵を取得
  secret: process.env.SESSION_SECRET,
  // セッションデータを保存するストアをMySQLに指定
  store: sessionStore,

  // セッションの管理方法を最適化
  // セッションが変更されたときだけ保存
  resave: false,
  // 実際にセッションが変更されるまでセッションを保存しない
  saveUninitialized: false,
  // クッキーの有効期限をミリ秒で指定(1時間)
  cookie: { maxAge: 1000 * 60 * 60 },
});

// 認証ミドルウェアの設定
// req.session.userIdが存在する場合、ユーザーはログインしているとみなし
function isLoggedIn(req, res, next) {
  console.log("セッションの状態:", req.session); 
  if (req.session.userId) {
    console.log("ユーザー認証済み", req.session.userId);
    return next();
  } else {
    console.log("ユーザー認証に失敗しました");
    // ログインしていない場合はindex.htmlにリダイレクト
    res.redirect("/");
  }
}

// モジュールのエクスポート

// 関数sessionMiddlewareとisLoggedInをモジュールとしてエクスポート
module.exports = {
  sessionMiddleware,
  isLoggedIn,
};
