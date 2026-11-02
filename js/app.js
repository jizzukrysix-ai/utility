(() => {
  const labels = {overview:"Overview",text:"Text tools",converter:"Unit converter",notes:"Quick notes",timer:"Timer & stopwatch",qr:"QR generator"};
  const views = [...document.querySelectorAll(".view")];
  function openView(name) {
    if (!labels[name]) return;
    views.forEach(v => v.classList.toggle("active", v.id === `view-${name}`));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === name));
    document.getElementById("page-breadcrumb").textContent = labels[name];
    window.scrollTo({top:0,behavior:"smooth"});
  }
  document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => openView(b.dataset.view)));
  document.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openView(b.dataset.open)));
  const now = new Date();
  document.getElementById("today-date").textContent = now.toLocaleDateString(undefined,{weekday:"long"}).toUpperCase();
  document.getElementById("today-day").textContent = now.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
  const toast = document.getElementById("toast"); let toastTimer;
  window.SUD = {toast(message) { toast.textContent=message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2600); }};
  document.getElementById("profile-button").addEventListener("click", () => window.SUD.toast("Welcome to Smart Utility Desk."));
})();
