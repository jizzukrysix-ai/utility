(() => {
  const list = document.getElementById("notes-list"); if (!list) return;
  const KEY = "smart-utility-desk-notes-v1";
  const $ = id => document.getElementById(id);
  let notes = [], editingId = null;
  try { notes = JSON.parse(localStorage.getItem(KEY) || "[]"); if (!Array.isArray(notes)) notes = []; } catch { notes = []; }
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch { window.SUD.toast("Could not save notes. Browser storage may be full."); } }
  function render() {
    $("note-count").textContent = notes.length;
    $("notes-list-count").textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
    if (!notes.length) { list.innerHTML = '<div class="empty-state"><span>▤</span><strong>No notes yet</strong><p>Your saved notes will appear here.</p></div>'; return; }
    list.innerHTML = notes.slice().sort((a,b) => b.updatedAt-a.updatedAt).map(n => `<article class="note-item ${n.id===editingId?"selected":""}" data-id="${n.id}"><strong>${escapeHTML(n.title || "Untitled note")}</strong><p>${escapeHTML(n.body || "No additional text")}</p><small>${new Date(n.updatedAt).toLocaleString()}</small></article>`).join("");
  }
  function reset() { editingId = null; $("note-title").value = ""; $("note-body").value = ""; $("note-editor-heading").textContent = "New note"; $("save-note").textContent = "Save note"; render(); }
  $("save-note").addEventListener("click", () => {
    const title = $("note-title").value.trim(), body = $("note-body").value.trim();
    if (!title && !body) { window.SUD.toast("Add a title or some note text first."); return; }
    const now = Date.now();
    if (editingId) { const note = notes.find(n => n.id === editingId); if (note) Object.assign(note, {title, body, updatedAt: now}); }
    else notes.push({id: `${now}-${Math.random().toString(36).slice(2,8)}`, title, body, createdAt: now, updatedAt: now});
    persist(); reset(); window.SUD.toast("Note saved on this device.");
  });
  $("new-note").addEventListener("click", reset);
  list.addEventListener("click", e => {
    const item = e.target.closest("[data-id]"); if (!item) return;
    const note = notes.find(n => n.id === item.dataset.id); if (!note) return;
    editingId = note.id; $("note-title").value = note.title; $("note-body").value = note.body;
    $("note-editor-heading").textContent = "Edit note"; $("save-note").textContent = "Update note"; render();
  });
  render();
})();
