document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.querySelector("#signinForm");

  if (signinForm) {
    console.log("サインインフォームが見つかりました");
    signinForm.addEventListener("submit", handleSignin);
  } else {
    console.log("サインインフォームが見つかりませんでした");
  }
});

async function handleSignin(event) {
  event.preventDefault();
  console.log("サインインフォームが送信されました");

  const username = document.getElementById("signin-username").value;
  const password = document.getElementById("signin-password").value;

  const signinData = {
    username: username,
    password: password,
  };

  console.log("サインイン情報:", signinData);

  try {
    const response = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signinData),
    });

    console.log("レスポンスステータス:", response.status);
    console.log("レスポンスヘッダー:", response.headers);

    const responseData = await response.json();
    if (response.ok) {
      console.log("サインイン成功:", responseData);
      // 登録成功後 サーバーから受け取ったリダイレクト先に移動
      window.location.href = responseData.redirectUrl;
    } else {
      console.error("サインイン失敗:", responseData);
    }
  } catch (error) {
    console.error("エラー:", error);
  }
}

