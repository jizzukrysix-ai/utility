(()=>{
 const rb=document.getElementById("show-rewarded-ad"),ib=document.getElementById("show-interstitial-ad"),fb=document.getElementById("ads-feedback");
 if(!rb||!ib||!fb)return;
 let rewarded=null,interstitial=null;const say=t=>fb.textContent=t;
 async function init(){
  try{
   const r=await fetch("/api/config",{cache:"no-store"});if(!r.ok)throw Error("Config unavailable");
   const c=await r.json();if(!window.Adsgram){say("AdsGram SDK did not load.");return;}
   if(c.adsgramRewardedBlockId)rewarded=window.Adsgram.init({blockId:c.adsgramRewardedBlockId,debug:!!c.adsgramDebug,debugConsole:!!c.adsgramDebug});
   if(c.adsgramInterstitialBlockId)interstitial=window.Adsgram.init({blockId:c.adsgramInterstitialBlockId,debug:!!c.adsgramDebug,debugConsole:!!c.adsgramDebug});
   say(rewarded||interstitial?"Optional ads configured. Core tools remain available.":"Ads disabled until block IDs are configured.");
  }catch(e){console.warn("AdsGram:",e);say("Ads unavailable. All tools remain usable.");}
 }
 rb.addEventListener("click",async()=>{
  if(!rewarded){say("Set 57640 in server environment.");return;}
  rb.disabled=true;say("Loading optional ad…");
  try{const result=await rewarded.show();say(result&&result.done?"Ad completed. Thank you.":"Ad ended without completion.");}
  catch(e){console.info("Rewarded ad skipped/unavailable:",e);say("No ad completed. You can keep using every tool.");}
  finally{rb.disabled=false;}
 });
 ib.addEventListener("click",async()=>{
  if(!interstitial){say("Set ADSGRAM_INTERSTITIAL_BLOCK_ID in server environment.");return;}
  ib.disabled=true;say("Loading optional ad…");
  try{await interstitial.show();say("Ad closed. Workspace ready.");}
  catch(e){console.info("Interstitial skipped/unavailable:",e);say("Ad unavailable. Continue using the app.");}
  finally{ib.disabled=false;}
 });
 init();
})();
