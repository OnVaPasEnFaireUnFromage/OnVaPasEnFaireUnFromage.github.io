document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  if (!window.supabase) {
    console.error("Supabase SDK non chargé. Ajoute le script CDN avant script.js");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const search = document.getElementById("search");
  const randomBtn = document.getElementById("randomBtn");
  const loginBtn = document.getElementById("loginBtn");
  const withiaBtn = document.getElementById("withiaBtn");
  const addBtn = document.getElementById("addBtn");

  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");

  const gallery = document.getElementById("gallery");

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

  /* 🔍 SEARCH */
  if (search) {
    search.addEventListener("input", () => {
      const value = search.value.toLowerCase().trim();
      const words = value.split(" ").filter(Boolean);

      getImages().forEach(img => {
        const tags = (img.dataset.tags || "").toLowerCase();
        const ok = words.every(w => tags.includes(w));
        img.style.display = ok ? "block" : "none";
      });
    });
  }

  /* 🎲 RANDOM */
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const imgs = getImages().filter(i => i.style.display !== "none");
      if (!imgs.length) return;

      const img = imgs[Math.floor(Math.random() * imgs.length)];
      img.scrollIntoView({ behavior: "smooth", block: "center" });
      openViewer(img.src);
    });
  }

  /* 🖼️ CLICK IMAGE -> viewer (event delegation = plus fiable) */
  if (gallery) {
    gallery.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      openViewer(img.src);
    });
  }

  if (viewer) {
    viewer.addEventListener("click", closeViewer);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeViewer();
  });

  /* 🔗 NAV */
  if (withiaBtn) {
    withiaBtn.addEventListener("click", () => {
      location.href = "withia.html";
    });
  }

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      location.href = "upload.html";
    });
  }

  /* 🔐 AUTH + ROLE UI */
  async function updateUI() {
    try {
      const { data: { session }, error } = await sb.auth.getSession();
      if (error) console.error("getSession error:", error);

      // pas connecté
      if (!session || !session.user) {
        if (loginBtn) {
          loginBtn.textContent = "Login";
          loginBtn.onclick = () => (location.href = "login.html");
        }
        if (addBtn) addBtn.style.display = "none";
        return;
      }

      // connecté
      if (loginBtn) {
        loginBtn.textContent = "Compte";
        loginBtn.onclick = () => (location.href = "account.html");
      }

      // par défaut on cache ➕
      if (addBtn) addBtn.style.display = "none";

      // récup role
      const { data: profile, error: roleErr } = await sb
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (roleErr) {
        console.error("profiles error:", roleErr);
        return;
      }

      if (profile && (profile.role === "admin" || profile.role === "contributor")) {
        if (addBtn) addBtn.style.display = "block";
      }
    } catch (e) {
      console.error("updateUI crash:", e);
    }
  }

  updateUI();
  sb.auth.onAuthStateChange(() => updateUI());
});