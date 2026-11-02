(() => {
  const input = document.getElementById("text-input");
  if (!input) return;
  const $ = id => document.getElementById(id);
  function analyze() {
    const text = input.value;
    const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
    const sentences = text.trim() ? (text.match(/[.!?]+(?=\s|$)/g) || []).length : 0;
    $("word-count").textContent = words.toLocaleString();
    $("char-count").textContent = text.length.toLocaleString();
    $("sentence-count").textContent = sentences.toLocaleString();
    $("reading-time").textContent = words ? `${Math.max(1, Math.ceil(words / 200))} min` : "0 min";
  }
  input.addEventListener("input", analyze);
  document.getElementById("clear-text").addEventListener("click", () => { input.value = ""; analyze(); input.focus(); });
  document.querySelectorAll("[data-transform]").forEach(button => button.addEventListener("click", () => {
    const value = input.value;
    switch (button.dataset.transform) {
      case "upper": input.value = value.toLocaleUpperCase(); break;
      case "lower": input.value = value.toLocaleLowerCase(); break;
      case "title": input.value = value.toLocaleLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, p, c) => p + c.toLocaleUpperCase()); break;
      case "sentence": input.value = value.toLocaleLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, p, c) => p + c.toLocaleUpperCase()); break;
      case "trim": input.value = value.replace(/\s+/gu, " ").trim(); break;
      case "reverse": input.value = Array.from(value).reverse().join(""); break;
    }
    analyze();
  }));
  document.getElementById("copy-text").addEventListener("click", async () => {
    if (!input.value) return window.SUD.toast("There is no text to copy.");
    try { await navigator.clipboard.writeText(input.value); window.SUD.toast("Text copied to clipboard."); }
    catch { window.SUD.toast("Clipboard access is unavailable in this browser."); }
  });
  analyze();
})();
