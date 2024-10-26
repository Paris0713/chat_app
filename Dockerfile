# ベースイメージとしてnode:20-bullseye-slimを使用
FROM node:20-bullseye-slim

# シェルとpingをインストール (Debianベース)	
RUN apt-get update && apt-get install -y bash iputils-ping

# 作業ディレクトリ
WORKDIR /app

# パッケージファイルをコピーして依存関係をインストール
COPY package*.json ./

# 依存関係をインストール
RUN npm install && npm cache clean --force

# wscatをグローバルインストール
RUN npm install -g wscat

# アプリケーションのソースコードをコピー
COPY . .

# コンテナがリッスンするポートを指定
EXPOSE 3000
EXPOSE 7000

# アプリケーションの起動コマンド
ENTRYPOINT ["/bin/bash"]
CMD ["npm start"]