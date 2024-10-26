// 環境変数の読み込み
require("dotenv").config();
// sessionの読み込み
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
// wsモジュールのインポート
const WebSocket = require("ws");
// logger.jsをインポート
const logger = require("./logger");
// sessionMiddleware, isLoggedInの読み込み
const { sessionMiddleware, isLoggedIn } = require("./db/session");
const { error, log } = require("winston");

// HTTPサーバーを作成してWebSocketサーバーと連携
// WebSocketサーバーの設定 コールバック関数 handleConnection
function setupWebSocket(server, handleConnection) {
  const wsPort = process.env.WS_PORT || 7000;

  // WebSocketサーバーのインスタンス作成
  const wss = new WebSocket.Server({
    noServer: true,
    path: "/ws",
    host: "0.0.0.0",
  });

  server.on("upgrade", (request, socket, head) => {
    sessionMiddleware(request, {}, (err) => {
      if (err) {
        console.error("セッションミドルウェアエラー:", err);
        logger.error(`セッションミドルウェアエラー: ${err.message}`);
        return socket.destroy();
      }
      if (request.session && request.session.userId) {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      } else {
        console.error("セッションが未定義または未認証です。");
        logger.error("セッションが未定義または未認証です。");
        socket.destroy();
      }
    });
  });

  // WebSocket接続の処理
  wss.on("connection", (ws, req) => {
    console.log("新しいクライアント接続を受け付けました");
    logger.info("新しいクライアント接続を受け付けました");

    // handleConnection呼び出し
    handleConnection(ws);

    ws.on("error", (error) => {
      const errorType = error.code ? `(code: ${error.code})` : "不明";
      console.error("WebSocketエラー:", error);
      logger.error(`WebSocketエラー: ${error.message}`, {
        // 追加でエラーに関する情報をログに出力
        clientIp: req.socket.remoteAddress,
        sessionId: req.session.id,
        errorStack: error.stack,
      });
      // クライアントにエラー通知を送信
      ws.send(
        JSON.stringify({
          error: "WebSocketError",
          type: errorType,
          message: error.message,
          code: error.code,
        })
      );

      // 接続を閉じる
      ws.close();
    });

    ws.on("close", (code, reason) => {
      console.log(
        `WebSocketが閉じられました。コード: ${code}, 理由: ${reason}`
      );
      logger.info(
        `WebSocketが閉じられました。コード: ${code}, 理由: ${reason}`
      );
    });

    ws.on("message", (message) => {
      console.log(`クライアントからのメッセージ: ${message}`);
      logger.info(`クライアントからのメッセージ: ${message}`);
    });

    // 簡単なメッセージ送信テスト
    ws.send("接続が確立されました");

    // ハートビートメカニズムを追加
    const interval = setInterval(() => {
      // ハートビートメカニズムを追加
      ws.ping(() => {});
    }, 30000); // 30秒ごとにping

    ws.on("pong", () => {
      console.log("クライアントからpongを受信しました");
    });

    // 接続が閉じられたらハートビートを停止
    ws.on("close", () => {
      clearInterval(interval);
    });
  });

  console.log("WebSocketサーバーの設定が完了しました");
  logger.info("WebSocketサーバーの設定が完了しました");

  console.log(`WebSocketサーバーがポート${wsPort}で起動しました`);
  logger.info(`WebSocketサーバーがポート${wsPort}で起動しました`);
}

module.exports = setupWebSocket;
