const LS_QUICK = "main_quick_v1";

const $ = (id) => document.getElementById(id);

function loadQuick() {
  try {
    const raw = localStorage.getItem(LS_QUICK);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQuick(items) {
  localStorage.setItem(LS_QUICK, JSON.stringify(items));
}

function renderQuick() {
  const ul = $("quickList");
  const items = loadQuick();
  ul.innerHTML = "";

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

window.addEventListener("load", () => {
  initTheme();
  renderQuick();

  $("quickSave").onclick = addQuick;
  $("quickClear").onclick = () => { saveQuick([]); renderQuick(); };
  $("btnQuick").onclick = () => $("quickInput").focus();
  $("btnTheme").onclick = toggleTheme;

  $("quickInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") addQuick();
  });

  // keyboard shortcut: "/" focuses quick input (unless typing in an input already)
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    const typing = tag === "input" || tag === "textarea";
    if (!typing && e.key === "/") {
      e.preventDefault();
      $("quickInput").focus();
    }
  });
});