<?php
// .envファイルの内容を読み込む
if (file_exists(__DIR__ . '/../.env')) {
    $env = parse_ini_file(__DIR__ . '/../.env');
    if (isset($env['SESSION_SECRET'])) {
        $cfg['blowfish_secret'] = $env['SESSION_SECRET']; // セッションのセキュリティを強化するための秘密鍵
    }
}
?>
