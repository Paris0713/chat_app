// 環境変数の読み込み
require('dotenv').config();

// 必要なもの 読み込み

// express-session: セッションを管理するためのミドルウェア
const session = require('express-session');
// express-mysql-session: MySQLをセッションストアとして利用するためのモジュール
const MySQLStore = require('express-mysql-session')(session);
// データベース設定
const config = require('./config');

// セッションストアの設定

// MySQLをセッションの保存先として利用するためのインスタンスを作成
const sessionStore = new MySQLStore(config.db);

// セッションミドルウェアの設定
const sessionMiddleware = session({
  // クッキーの名前を指定
  key: 'session_cookie_name',
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
  cookie: {
    maxAge: 1000 * 60 * 60
  }
});

// 認証ミドルウェアの設定
// req.session.userIdが存在する場合、ユーザーはログインしているとみなし
function isLoggedIn(req, res, next) {
    if (req.session.userId) {
        return next();
    }
  // ログインしていない場合はindex.htmlにリダイレクト
  res.redirect('/');
}

// モジュールのエクスポート

// 関数sessionMiddlewareとisLoggedInをモジュールとしてエクスポート
module.exports = {
  sessionMiddleware,
  isLoggedIn
};
