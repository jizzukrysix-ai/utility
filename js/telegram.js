(function(){
 const tg=window.Telegram&&window.Telegram.WebApp;
 if(!tg){document.documentElement.dataset.telegram="unavailable";return;}
 try{
  tg.ready();tg.expand();
  if(tg.setHeaderColor)tg.setHeaderColor("#111c30");
  if(tg.setBackgroundColor)tg.setBackgroundColor("#f6f8fb");
  const u=tg.initDataUnsafe&&tg.initDataUnsafe.user;
  const avatar=document.getElementById("profile-button");
  if(avatar&&u)avatar.textContent=(u.first_name||"U").charAt(0).toUpperCase();
  if(tg.initData){
   fetch("/api/telegram/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({initData:tg.initData})})
   .then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Verification failed");window.SUDTelegramUser=d.user;document.documentElement.dataset.telegram="verified";window.dispatchEvent(new CustomEvent("sud:telegram-verified",{detail:d.user}));})
   .catch(e=>{console.warn("Telegram verification:",e.message);document.documentElement.dataset.telegram="unverified";});
  }else document.documentElement.dataset.telegram="no-init-data";
 }catch(e){console.warn("Telegram SDK setup:",e);}
})();
