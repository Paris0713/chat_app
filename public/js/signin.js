document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#form-register');

    if (registerForm) {
        console.log('登録フォームが見つかりました');
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.log('登録フォームが見つかりませんでした');
    }
});

async function handleRegister(event) {
    event.preventDefault();
    console.log('登録フォームが送信されました');
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;

    const registerData = {
        username: username,
        password: password,
        passwordConfirm: passwordConfirm
    };

    console.log('登録情報:', registerData);

    try {
        const response = await fetch('/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        console.log('レスポンスステータス:', response.status);
        console.log('レスポンスヘッダー:', response.headers);

        const responseData = await response.json();
        if (response.ok) {
            console.log('登録成功:', responseData);
            window.location.href = '/login'; // 登録成功後のリダイレクト先
        } else {
            console.error('登録失敗:', responseData);
        }
    } catch (error) {
        console.error('エラー:', error);
    }
}

// ログインしていないときのアラート
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'unauthorized') {
      alert('ログインが必要です。');
    }
  });
  
  