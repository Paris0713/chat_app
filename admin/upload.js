const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// ストレージ設定 オリジナルのファイル名から拡張子を取得し、保存するファイル名に追加
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // デバッグ用
    console.log('Original filename:', file.originalname);
    const ext = path.extname(file.originalname);
    // デバッグ用
    console.log('Extension:', ext);
    cb(null, `${Date.now()}${ext}`);
  }
});

// ファイルフィルタを追加
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif']; 
  const ext = path.extname(file.originalname);
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// ストレージとフィルタを使用するように設定
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    // デバッグ用
    console.log('Uploaded file info:', req.file);
    res.send('画像がアップロードされました: ' + req.file.filename);
  } else {
    res.status(400).send('無効なファイルタイプです');
  }
});

// app.listen(3000, () => {
//   console.log('サーバーが起動しました');
// });

// モジュールとしてエクスポート
module.exports = upload;
