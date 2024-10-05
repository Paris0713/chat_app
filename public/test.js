// DOMContentLoadedイベントリスナー フォーム要素を取得
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup-form');

    if (signupForm) {
        console.log('登録フォームが見つかりました');
        // 登録フォームが送信されたとき handleSignup関数が呼び出し
        signupForm.addEventListener('submit', handleSignup);
    } else {
        console.log('登録フォームが見つかりませんでした');
    }
});

// 非同期関数
async function handleSignup(event) {
    // デフォルトのフォーム送信動作をキャンセルしカスタムの送信処理を行う
    event.preventDefault();
    console.log('登録フォームが送信されました');

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;
    const email = document.getElementById('signup-email').value;

    // バリデーション
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password, passwordConfirm);
    const emailError = validateEmail(email);

    if (usernameError || passwordError || emailError) {
        showErrorMessage(usernameError || passwordError || emailError);
        return;
    }

    // 取得した値をオブジェクトに
    const signupData = {
        username: username,
        password: password,
        passwordConfirm: passwordConfirm,
        email: email
    };

    console.log('登録情報:', signupData);

    // エラーハンドリング
    try {
        // エンドポイントを指定
        const response = await fetch('./routes/register', {
            method: 'POST',
            // JSON形式のデータ
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });

        console.log('レスポンスステータス:', response.status);
        console.log('レスポンスヘッダー:', response.headers);

        const responseData = await response.json();
        if (response.ok) {
            console.log('登録成功:', responseData);
            window.location.href = '/myroom.html';
        } else {
            console.error('登録失敗:', responseData);
            showErrorMessage(responseData.message || '登録に失敗しました。');
        }
    } catch (error) {
        console.error('エラー:', error);
        showErrorMessage('エラーが発生しました。');
    }
}
