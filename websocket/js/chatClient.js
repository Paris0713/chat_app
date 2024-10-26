console.log("WebSocketクライアントスクリプトがロードされました");

// WebSocketの初期化
let ws;
// WebSocketの初期化関数
function initializeWebSocket() {
  ws = new WebSocket("ws://chat_app-app-1:7000/ws");

  ws.onopen = () => {
    console.log("サーバーに接続しました");
  };

  // エラーハンドリング
  ws.onerror = (event) => {
    console.error("WebSocketエラー:", event);

    // サーバーからエラーメッセージがJSON形式で送られてきた場合
    if (typeof event.data === "string") {
      try {
        const data = JSON.parse(event.data);
        if (data.error === "WebSocketError") {
          console.error("サーバーからのエラー:", data);
          // エラーの種類に応じて処理を分岐
          if (data.type === "接続拒否") {
            alert(
              "サーバーに接続できません。しばらくしてから再度お試しください。"
            );
          } else {
            alert(
              "予期せぬエラーが発生しました。詳細については、ログを確認してください。"
            );
          }
        }
      } catch (error) {
        console.error("JSONパースエラー:", error);
      }
    } else {
      console.error("予期せぬエラーデータ:", event.data);
    }
  };

  ws.onmessage = (event) => {
    // 受信メッセージのログ
    console.log("サーバーからのメッセージ:", event.data);
    const messages = document.getElementById("messages");
    const message = document.createElement("li");
    message.textContent = `サーバー: ${event.data}`;
    message.className = "received";
    messages.appendChild(message);
  };

  ws.onclose = (event) => {
    if (event.wasClean) {
      console.log("正常に接続が切れました");
    } else {
      console.error("接続が予期せず切断されました", event);
      alert("接続が予期せず切断されました");
    }
    alert("サーバーとの接続が切れました。");
  };
}

function sendMessage() {
  try {
    const input = document.getElementById("message");
    // wsが定義されているか確認 &&ws
    if (ws && ws.readyState === WebSocket.OPEN) {
      // 送信メッセージのログ
      console.log("メッセージを送信します:", input.value);
      ws.send(input.value);
      const messages = document.getElementById("messages");
      const message = document.createElement("li");
      message.textContent = `自分: ${input.value}`;
      message.className = "sent";
      messages.appendChild(message);
      input.value = "";
    } else {
      alert("接続されていません。");
    }
  } catch (error) {
    console.error("メッセージ送信中にエラーが発生しました:", error);
    console.error("WebSocket初期化エラー:", error);
  }
}

// WebSocket接続を閉じる関数
function disconnect() {
  ws.close();
}
// ページロード時にWebSocketを初期化
window.onload = initializeWebSocket;
