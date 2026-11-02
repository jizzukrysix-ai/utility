(() => {
  const $ = id => document.getElementById(id); if (!$("timer-display")) return;
  let timerInterval = null, remaining = 300, timerEnd = 0, timerRunning = false;
  let watchInterval = null, watchStart = 0, elapsed = 0, watchRunning = false, lapCount = 0;
  const format = seconds => `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  function updateTimer() { $("timer-display").textContent = format(remaining); }
  function stopTimer() { clearInterval(timerInterval); timerInterval = null; timerRunning = false; $("timer-start").textContent = "Start timer"; }
  function tickTimer() { remaining = Math.max(0, Math.ceil((timerEnd-Date.now())/1000)); updateTimer(); if (remaining <= 0) { stopTimer(); $("timer-feedback").textContent = "Time is up. Well done!"; if (navigator.vibrate) navigator.vibrate([180,80,180]); } }
  function resetTimer() { stopTimer(); remaining = Math.max(0, Number($("timer-minutes").value||0)*60 + Number($("timer-seconds").value||0)); updateTimer(); $("timer-feedback").textContent = ""; }
  $("timer-start").addEventListener("click", () => {
    if (timerRunning) { tickTimer(); stopTimer(); $("timer-feedback").textContent = "Timer paused."; return; }
    if (remaining <= 0) resetTimer();
    if (remaining <= 0) { $("timer-feedback").textContent = "Choose a duration greater than zero."; return; }
    timerEnd = Date.now() + remaining*1000; timerRunning = true; $("timer-start").textContent = "Pause";
    $("timer-feedback").textContent = ""; timerInterval = setInterval(tickTimer, 200);
  });
  $("timer-reset").addEventListener("click", resetTimer);
  ["timer-minutes","timer-seconds"].forEach(id => $(id).addEventListener("change", () => { if (!timerRunning) resetTimer(); }));
  function watchValue() { return elapsed + (watchRunning ? Date.now()-watchStart : 0); }
  function updateWatch() { const ms=watchValue(), tenths=Math.floor(ms/100)%10, sec=Math.floor(ms/1000); $("stopwatch-display").textContent = `${format(sec)}.${tenths}`; }
  $("stopwatch-start").addEventListener("click", () => {
    if (watchRunning) { elapsed=watchValue(); watchRunning=false; clearInterval(watchInterval); $("stopwatch-start").textContent="Resume"; }
    else { watchStart=Date.now(); watchRunning=true; watchInterval=setInterval(updateWatch,80); $("stopwatch-start").textContent="Pause"; }
    updateWatch();
  });
  $("stopwatch-lap").addEventListener("click", () => {
    if (!watchRunning && !elapsed) return;
    lapCount++; const row=document.createElement("div"); row.className="lap-row";
    const label=document.createElement("span"); label.textContent=`Lap ${lapCount}`;
    const time=document.createElement("strong"); const ms=watchValue(); time.textContent=`${format(Math.floor(ms/1000))}.${Math.floor(ms/100)%10}`;
    row.append(label,time); $("laps-list").prepend(row);
  });
  $("stopwatch-reset").addEventListener("click", () => { clearInterval(watchInterval); watchRunning=false; elapsed=0; lapCount=0; $("stopwatch-start").textContent="Start"; $("laps-list").innerHTML='<span class="muted">Lap times will appear here.</span>'; updateWatch(); });
  updateTimer(); updateWatch();
})();
