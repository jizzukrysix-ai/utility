(function () {
  const tg = window.Telegram && window.Telegram.WebApp;
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    if (tg.setHeaderColor) tg.setHeaderColor("#111c30");
    if (tg.setBackgroundColor) tg.setBackgroundColor("#f6f8fb");
    const user = tg.initDataUnsafe && tg.initDataUnsafe.user;
    const avatar = document.getElementById("profile-button");
    if (avatar && user) avatar.textContent = (user.first_name || "U").charAt(0).toUpperCase();
  } catch (error) {
    console.warn("Telegram Web App setup could not complete:", error);
  }
})();
