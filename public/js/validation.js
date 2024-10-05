// フィールドのバリデーション関数
// username
function validateUsername(username) {
    if (!username) {
        return 'ユーザー名は必須です。';
    }
    return '';
}

// password
function validatePassword(password, passwordConfirm) {
    if (!password) {
        return 'パスワードは必須です。';
    }
    if (password !== passwordConfirm) {
        return 'パスワードが一致しません。';
    }
    return '';
}

// email
function validateEmail(email) {
    // 正規表現パターンを格納する変数(記号はメールアドレスの形式を表す正規表現)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return 'メールアドレスは必須です。';
    }
    if (!emailPattern.test(email)) {
        return 'メールアドレスが無効です。';
    }
    return '';
}

// エラーメッセージを表示する
function showErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    if (errorMessageDiv) {
        errorMessageDiv.textContent = message;
    }
}