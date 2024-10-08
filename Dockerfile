# ベースイメージ
FROM node:20

# 作業ディレクトリ
WORKDIR /app

# パッケージファイルをコピーして依存関係をインストール
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# コンテナがリッスンするポートを指定
EXPOSE 3000
EXPOSE 5000

# アプリケーションの起動コマンド
CMD ["npm", "start"]