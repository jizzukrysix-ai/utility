(() => {
  const input = document.getElementById("qr-input"); if (!input) return;
  const output = document.getElementById("qr-output"), download = document.getElementById("download-qr");
  let generated = false;
  function generate() {
    const text = input.value.trim();
    if (!text) { window.SUD.toast("Enter text or a URL first."); return; }
    if (typeof QRCode === "undefined") { window.SUD.toast("QR library did not load. Check your internet connection and try again."); return; }
    output.innerHTML = "";
    const size = Number(document.getElementById("qr-size").value);
    new QRCode(output, {text, width:size, height:size, colorDark:"#172033", colorLight:"#ffffff", correctLevel:QRCode.CorrectLevel.M});
    generated = true; download.disabled = false;
    document.getElementById("qr-feedback").textContent = "QR code generated.";
  }
  document.getElementById("generate-qr").addEventListener("click", generate);
  document.getElementById("clear-qr").addEventListener("click", () => {
    input.value = ""; output.innerHTML = '<div class="qr-placeholder"><span>▦</span><strong>Your code goes here</strong><small>Enter content and select Generate.</small></div>';
    download.disabled = true; generated = false; document.getElementById("qr-feedback").textContent = "";
  });
  download.addEventListener("click", () => {
    if (!generated) return;
    const canvas = output.querySelector("canvas");
    const img = output.querySelector("img");
    const url = canvas ? canvas.toDataURL("image/png") : img ? img.src : null;
    if (!url) { window.SUD.toast("The QR image is not ready yet."); return; }
    const a=document.createElement("a"); a.href=url; a.download="smart-utility-desk-qr.png"; document.body.appendChild(a); a.click(); a.remove();
  });
})();
