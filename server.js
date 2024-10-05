// dotenvを読み込み
require('dotenv').config();
// expressをインポート
const express = require('express');
// register.jsをインポート
const registerRouter = require('./routes/register');
// session.jsをインポート
const { sessionMiddleware, isLoggedIn } = require('./db/session');
// upload.jsをインポート
const upload = require('./admin/upload');


// HTTPサーバーを作成するための組み込みモジュール
const http = require('http');
// fs: ファイルシステムを操作するためのモジュール
const fs = require('fs');
// path: ファイルやディレクトリのパスを操作するためのモジュール
const path = require('path');
// wsライブラリを読み込み
const WebSocket = require('ws');
const { error } = require('console');

// Expressアプリケーションを作成
const app = express();

// セッションミドルウェアを設定
app.use(sessionMiddleware);

// 環境変数取得 設定されていなければ3000を使用
const port = process.env.PORT || 3000;
const wsPort = process.env.WS_PORT || 5000;

// 静的ファイルの提供
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
// アップローダー追加
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ルートパスにアクセスしたときにindex.htmlを返す
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  console.log(`Serving file from: ${filePath}`);

  // ファイルの存在確認
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`${filePath} does not exist`);
      res.status(404).send('File not found');
    } else {
      console.log(`${filePath} exists`);
      // ファイルを送信
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error(`Error sending file: ${err}`);
          res.status(err.status).end();
        }
      });
    }
  });
});



// 画像アップロードのエンドポイント
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    console.log('uploaded fileinfo:', req.file);
    res.send(`画像がアップロードされました: <a href="/uploads/${req.file.filename}">こちら</a>`);
  } else {
    res.status(400).send('無効なファイルタイプです')
  }  
});




// registerのルート
app.use('/register', registerRouter);

// 認証が必要なルート

// chat画面へのルート
app.get('/chat', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'protected', 'chat.html'));
});

// マイルーム画面へのルート
app.get('/myroom', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'protected', 'myroom.html'));
})

// HTTPサーバーの設定
const server = http.createServer(app);

// WebSocketサーバーの設定
const wss = new WebSocket.Server({ port: wsPort });


wss.on('connection', (ws) => {
  console.log(`クライアントが接続しました。現在の接続数: ${wss.clients.size}`);

  ws.on('message', (message) => {
    console.log(`受信メッセージ: ${message}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`サーバーからの応答: ${message}`);
      }
    });
  });

  ws.on('error', (error) => {
    console.error('WebSocketエラーが発生しました:', error);
  });

  ws.on('close', () => {
    console.log(`クライアントが切断しました。現在の接続数: ${wss.clients.size - 1}`);
  });
});

// サーバーの起動
server.listen(port, '0.0.0.0', () => {
  console.log(`HTTPサーバーがポート${port}で起動しました`);
});

console.log(`WebSocketサーバーがポート${wsPort}で起動しました`);
