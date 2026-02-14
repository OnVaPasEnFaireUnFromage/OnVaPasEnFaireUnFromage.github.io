document.addEventListener("DOMContentLoaded", () => {
  // === SUPABASE CONFIG ===
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  if (!window.supabase) {
    console.error("Supabase SDK non chargé. Ajoute le script CDN supabase-js avant script.js");
    return;
  }
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // === ELEMENTS ===
  const search = document.getElementById("search");
  const randomBtn = document.getElementById("randomBtn");
  const loginBtn = document.getElementById("loginBtn");
  const withiaBtn = document.getElementById("withiaBtn");
  const withoutiaBtn = document.getElementById("withoutiaBtn");
  const addBtn = document.getElementById("addBtn");

  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");
  const gallery = document.getElementById("gallery");

  // === HELPERS ===
  function getImages() {
    return Array.from(document.querySelectorAll("#gallery img"));
  }

  function openViewer(src) {
    if (!viewer || !viewerImg) return;
    viewerImg.src = src;
    viewer.style.display = "flex";
  }

  function closeViewer() {
    if (!viewer || !viewerImg) return;
    viewer.style.display = "none";
    viewerImg.src = "";
  }

  // === SEARCH ===
  if (search) {
    search.addEventListener("input", () => {
      const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      getImages().forEach(img => {
        const tags = (img.dataset.tags || "").toLowerCase();
        const ok = words.every(w => tags.includes(w));
        img.style.display = ok ? "block" : "none";
      });
    });
  }

  // === RANDOM ===
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const visibleImages = getImages().filter(img => img.style.display !== "none");
      if (!visibleImages.length) return;

      const img = visibleImages[Math.floor(Math.random() * visibleImages.length)];
      img.scrollIntoView({ behavior: "smooth", block: "center" });
      openViewer(img.src);
    });
  }

  // === CLICK IMAGE -> VIEWER ===
  if (gallery) {
    gallery.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      openViewer(img.src);
    });
  }

  if (viewer) viewer.addEventListener("click", closeViewer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeViewer();
  });

  // === NAV ===
  if (withiaBtn) withiaBtn.addEventListener("click", () => (window.location.href = "withia.html"));
  if (withoutiaBtn) withoutiaBtn.addEventListener("click", () => (window.location.href = "withoutia.html"));

  // === HEADER HIDE ON SCROLL ===
  const header = document.querySelector("header");
  if (header) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) header.classList.add("hide");
      else header.classList.remove("hide");
      lastScroll = currentScroll;
    });
  }

  // === AUTH UI ===
  // bouton reste "Login" tout le temps,
  // mais le click va soit vers login.html soit vers account.html
  let loginTarget = "login.html";

  function bindLoginBtn() {
    if (!loginBtn) return;
    loginBtn.textContent = "Login";
    loginBtn.onclick = () => (window.location.href = loginTarget);
  }
  bindLoginBtn();

  // === ➕ Upload ===
  if (addBtn) {
    addBtn.style.display = "none";
    addBtn.onclick = () => (window.location.href = "upload.html");
  }

  async function ensureProfileRow(user) {
    // tente de créer une row profiles si elle n'existe pas
    // (ça marche seulement si ta policy RLS l'autorise)
    try {
      const { data: existing, error } = await sb
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && existing) return existing;

      const { data: inserted, error: insErr } = await sb
        .from("profiles")
        .insert({ id: user.id, role: "user" })
        .select("id, role")
        .single();

      if (insErr) return null;
      return inserted;
    } catch {
      return null;
    }
  }

  async function refreshAuthAndRole() {
    const { data: { session } } = await sb.auth.getSession();

    // pas connecté
    if (!session || !session.user) {
      loginTarget = "login.html";
      bindLoginBtn();
      if (addBtn) addBtn.style.display = "none";
      return;
    }

    // connecté
    loginTarget = "account.html";
    bindLoginBtn();

    if (!addBtn) return;
    addBtn.style.display = "none";

    const profile = await ensureProfileRow(session.user);

    if (profile && (profile.role === "admin" || profile.role === "contributor")) {
      addBtn.style.display = "block";
    }
  }

  refreshAuthAndRole();
  sb.auth.onAuthStateChange(() => refreshAuthAndRole());
});
