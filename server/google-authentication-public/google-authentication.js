const accessToken = document.getElementById("access-token").innerText;
const refreshToken = document.getElementById("refresh-token").innerText;
const user = document.getElementById("user").innerText;
localStorage.setItem("DilaNaMaturitu_AccessToken", `Bearer ${accessToken}`);
localStorage.setItem("DilaNaMaturitu_RefreshToken", `Bearer ${refreshToken}`);
localStorage.setItem("DilaNaMaturitu_User", user);
window.location.href = "/";