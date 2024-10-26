// dotenvを読み込み
require("dotenv").config();
// expressをインポート
const express = require("express");
// Expressアプリケーションを作成
const app = express();
// helmetインポート
// const helmet = require('helmet');
// データベース接続をインポート
const connection = require("./db/connection");
// session.jsをインポート
const { sessionMiddleware, isLoggedIn } = require("./db/session");
// register.jsをインポート
const registerRouter = require("./routes/register");
// signinRoutes.jsをインポート
const signinRouter = require("./routes/signinRoute");

// upload.jsをインポート
const upload = require("./admin/upload");
// morganをインポート
const morgan = require("morgan");

// HTTPサーバーを作成するための組み込みモジュール
const http = require("http");
// fs: ファイルシステムを操作するためのモジュール
const fs = require("fs");
// path: ファイルやディレクトリのパスを操作するためのモジュール
const path = require("path");
// WebSocket設定ファイルを読み込み
const setupWebSocket = require("./websocket");
// ユーザーログイン管理ファイル読み込み
const handleConnection = require("./websocket/userStatus");
// logger.jsをインポート
const logger = require("./logger");
// favicon
// const baseDir = process.env.BASE_DIR;
const faviconPath = "/public/img/favicon.ico";

// CORS設定
const cors = require("cors");
app.use(
  cors({
    origin: "*", // すべてのオリジンを許可。特定のオリジンに制限する場合は、例えば 'http://example.com' のように指定します。
    methods: ["GET", "POST"], // 許可するHTTPメソッドを指定します。ここではGETとPOSTが許可されます。
    allowedHeaders: ["Content-Type"], // 許可するHTTPヘッダーを指定します。ここではContent-Typeヘッダーが許可されます。
    credentials: true, // クッキーなどの認証情報を含めたリクエストを許可するかどうかを指定します。
  })
);

// Content Security Policy (CSP)の設定
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "connect-src 'self' ws://chat_app-app-1:7000; " +
      "img-src 'self' data:; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "script-src 'self' 'unsafe-inline' 'nonce-abcdef';"
  );
  next();
});


// helmetの設定

// app.use(helmet({
//   contentSecurityPolicy: false
// }));

// Morganミドルウェアの設定
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// logsフォルダの作成
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// JSONボディをパースするミドルウェアを設定
app.use(express.json());

// セッションミドルウェアを設定
app.use(sessionMiddleware);

// 環境変数取得 設定されていなければ3000を使用
const port = process.env.PORT || 3000;

// 静的ファイルの提供
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/websocket", express.static(path.join(__dirname, "websocket")));

// アップローダー追加
app.use("/admin", express.static(path.join(__dirname, "admin")));

// ルートパスにアクセスしたときにindex.htmlを返す
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");
  logger.info(`Serving file from: ${filePath}`);

  // ファイルの存在確認
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      logger.error(`${filePath} does not exist`);
      res.status(404).send("File not found");
    } else {
      logger.info(`${filePath} exists`);
      // ファイルを送信
      res.sendFile(filePath, (err) => {
        if (err) {
          logger.error(`Error sending file: ${err}`);
          res.status(err.status).end();
        }
      });
    }
  });
});

// registerのルート
app.use("/register", registerRouter);

// signinのルート
app.use("/signin", signinRouter);

// 認証が必要なルート
// chat画面へのルート

app.get("/chat", isLoggedIn, (req, res) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' ws://chat_app_app_1:7000; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'nonce-abcdef';"
  );
  res.sendFile(path.join(__dirname, "protected", "chat.html"));
});

// マイルーム画面へのルート
app.get("/myroom", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "protected", "myroom.html"));
});

// 画像アップロードのエンドポイント
app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    logger.info("uploaded fileinfo: " + JSON.stringify(req.file));
    res.send(
      `画像がアップロードされました: <a href="/uploads/${req.file.filename}">こちら</a>`
    );
  } else {
    res.status(400).send("無効なファイルタイプです");
  }
});

// HTTPサーバーの設定
const server = http.createServer(app);

// WebSocketサーバーの設定を呼び出し
setupWebSocket(server, handleConnection);

// wss.on("connection", (ws) => {
//   logger.info(`クライアントが接続しました。現在の接続数: ${wss.clients.size}`);

//   ws.on("message", (message) => {
//     logger.info(`受信メッセージ: ${message}`);
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(`サーバーからの応答: ${message}`);
//       }
//     });
//   });

//   ws.on("error", (error) => {
//     logger.error("WebSocketエラーが発生しました:", error);
//   });

//   ws.on("close", () => {
//     logger.info(
//       `クライアントが切断しました。現在の接続数: ${wss.clients.size - 1}`
//     );
//   });
// });

// サーバーの起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  logger.info(`HTTPサーバーがポート${PORT}で起動しました`);
});
