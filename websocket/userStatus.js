// isLoggedInモジュールのインポート
const { isLoggedIn } = require("../db/session");
// MapオブジェクトonlineUsersを作成
const onlineUsers = new Map();

// WebSocket接続の処理 handleConnection関数
function handleConnection(ws, req) {
  isLoggedIn(req, null, () => {
    // userId を取得
    const userId = req.session.userId;
    if (userId) {
      // ユーザーをオンラインに設定
      onlineUsers.set(userId, ws);
      // 状態をブロードキャスト
      broadcastUserStatus(userId, "online");

      // 接続が切断されたときに呼び出される関数
      ws.on("close", () => {
        // ユーザーを削除
        onlineUsers.delete(userId);
        // オフライン状態をブロードキャスト
        broadcastUserStatus(userId, "offline");
      });
    }
  });

  // 特定のユーザーの状態変更を全てのクライアントに通知するための関数
  function broadcastUserStatus(userId, status) {
    const message = JSON.stringify({ type: "userStatus", userId, status });
    onlineUsers.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}


module.exports = handleConnection;
