import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {createHmac,timingSafeEqual} from "node:crypto";
import {fileURLToPath} from "node:url";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config();
const app=express(),PORT=Number(process.env.PORT||3000),DIR=path.dirname(fileURLToPath(import.meta.url));
const BOT_TOKEN=process.env.TELEGRAM_BOT_TOKEN||"",MAX_AGE=Number(process.env.TELEGRAM_INIT_DATA_MAX_AGE||86400);
app.disable("x-powered-by");app.use(helmet({contentSecurityPolicy:false,crossOriginEmbedderPolicy:false}));app.use(express.json({limit:"20kb"}));
const limiter=rateLimit({windowMs:60000,limit:30,standardHeaders:"draft-7",legacyHeaders:false});
function equalHash(a,b){if(!/^[a-f0-9]{64}$/i.test(a)||!/^[a-f0-9]{64}$/i.test(b))return false;const x=Buffer.from(a,"hex"),y=Buffer.from(b,"hex");return x.length===y.length&&timingSafeEqual(x,y);}
function verifyInitData(raw){
 if(!BOT_TOKEN)throw Error("Server missing TELEGRAM_BOT_TOKEN.");
 if(typeof raw!=="string"||!raw||raw.length>10000)throw Error("Missing or invalid initData.");
 const params=new URLSearchParams(raw),hash=params.get("hash");if(!hash)throw Error("Telegram initData hash missing.");
 const entries=[...params.entries()],seen=new Set();for(const [k] of entries){if(seen.has(k))throw Error("Duplicate initData field.");seen.add(k);}
 const authDate=Number(params.get("auth_date")),now=Math.floor(Date.now()/1000);
 if(!Number.isFinite(authDate)||authDate>now+60||now-authDate>MAX_AGE)throw Error("Telegram initData expired. Reopen the Mini App.");
 const check=entries.filter(([k])=>k!=="hash").sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>`${k}=${v}`).join("\\n");
 const secret=createHmac("sha256","WebAppData").update(BOT_TOKEN).digest();
 const calculated=createHmac("sha256",secret).update(check).digest("hex");
 if(!equalHash(calculated,hash))throw Error("Invalid Telegram initData signature.");
 let user;try{user=JSON.parse(params.get("user")||"null");}catch{throw Error("Malformed Telegram user payload.");}
 if(!user||!Number.isSafeInteger(user.id))throw Error("Telegram user data missing.");
 return {id:user.id,firstName:typeof user.first_name==="string"?user.first_name:"",username:typeof user.username==="string"?user.username:null,languageCode:typeof user.language_code==="string"?user.language_code:null,authDate};
}
app.get("/api/health",(_q,s)=>s.json({ok:true,service:"smart-utility-desk",version:"1.1.0"}));
app.get("/api/config",(_q,s)=>{s.set("Cache-Control","no-store");s.json({adsgramRewardedBlockId:process.env.ADSGRAM_REWARDED_BLOCK_ID||"",adsgramInterstitialBlockId:process.env.ADSGRAM_INTERSTITIAL_BLOCK_ID||"",adsgramDebug:process.env.ADSGRAM_DEBUG==="true"});});
app.post("/api/telegram/session",limiter,(q,s)=>{try{s.set("Cache-Control","no-store");s.json({ok:true,user:verifyInitData(q.body?.initData)});}catch(e){const m=e instanceof Error?e.message:"Telegram verification failed.";s.status(m.includes("TELEGRAM_BOT_TOKEN")?503:401).json({ok:false,error:m});}});
app.use(express.static(DIR,{index:"index.html",etag:true,maxAge:process.env.NODE_ENV==="production"?"1h":0}));
app.get("*",(q,s,n)=>{if(q.path.startsWith("/api/"))return s.status(404).json({error:"API route not found."});s.sendFile(path.join(DIR,"index.html"),e=>e&&n(e));});
app.listen(PORT,()=>{console.log(`Smart Utility Desk listening on ${PORT}`);if(!BOT_TOKEN)console.warn("Set TELEGRAM_BOT_TOKEN to enable Telegram verification.");});
