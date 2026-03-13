const LS_QUICK = "main_quick_v1";
const $ = (id) => document.getElementById(id);

function loadQuick() {
  try {
    const raw = localStorage.getItem(LS_QUICK);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveQuick(items) { localStorage.setItem(LS_QUICK, JSON.stringify(items)); }

function renderQuick() {
  const ul = $("quickList");
  const items = loadQuick();
  ul.innerHTML = "";
  $("statQuick").textContent = String(items.length);

  items.forEach((it, idx) => {
    const li = document.createElement("li");

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = it.text;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = new Date(it.ts).toLocaleString();

    const del = document.createElement("button");
    del.className = "btn danger";
    del.type = "button";
    del.textContent = "Delete";
    del.onclick = () => {
      items.splice(idx, 1);
      saveQuick(items);
      renderQuick();
    };

    li.appendChild(text);
    li.appendChild(meta);
    li.appendChild(del);
    ul.appendChild(li);
  });
}

function addQuick() {
  const input = $("quickInput");
  const val = input.value.trim();
  if (!val) return;

  const items = loadQuick();
  items.unshift({ text: val, ts: Date.now() });
  saveQuick(items);

  input.value = "";
  renderQuick();
}

function toggleTheme() {
  document.documentElement.classList.toggle("light");
  localStorage.setItem("theme_light", document.documentElement.classList.contains("light") ? "1" : "0");
}

function initTheme() {
  const on = localStorage.getItem("theme_light") === "1";
  if (on) document.documentElement.classList.add("light");
}

function setTodayPill() {
  const d = new Date();
  $("todayPill").textContent = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

window.addEventListener("load", () => {
  initTheme();
  setTodayPill();
  renderQuick();

  $("quickSave").onclick = addQuick;
  $("quickClear").onclick = () => { saveQuick([]); renderQuick(); };

  $("btnQuick").onclick = () => $("quickInput").focus();
  $("heroQuick").onclick = () => {
    const panel = $("quickPanel");
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => $("quickInput").focus(), 250);
  };

  $("btnTheme").onclick = toggleTheme;

  $("quickInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addQuick();
  });

  // "/" focuses quick input (unless typing already)
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    const typing = tag === "input" || tag === "textarea";
    if (!typing && e.key === "/") {
      e.preventDefault();
      $("quickInput").focus();
      $("quickPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});