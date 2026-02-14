document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  if (!window.supabase) {
    console.error("Supabase SDK non chargé (le CDN n'est pas chargé)");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const topbar = document.querySelector(".topbar");
  const search = document.getElementById("search");
  const randomBtn = document.getElementById("randomBtn");
  const loginBtn = document.getElementById("loginBtn");
  const withiaBtn = document.getElementById("withiaBtn");
  const addBtn = document.getElementById("addBtn");

  const gallery = document.getElementById("gallery");
  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");

  function getImages() {
    return Array.from(document.querySelectorAll("#gallery img"));
  }

  function openViewer(src) {
    if (!viewer || !viewerImg) return;
    viewerImg.src = src;
    viewer.style.display = "flex";
    viewer.setAttribute("aria-hidden", "false");
  }

  function closeViewer() {
    if (!viewer || !viewerImg) return;
    viewer.style.display = "none";
    viewerImg.src = "";
    viewer.setAttribute("aria-hidden", "true");
  }

  // SEARCH
  if (search) {
    search.addEventListener("input", () => {
      const words = search.value.toLowerCase().trim().split(" ").filter(Boolean);
      getImages().forEach(img => {
        const tags = (img.dataset.tags || "").toLowerCase();
        const ok = words.every(w => tags.includes(w));
        img.style.display = ok ? "block" : "none";
      });
    });
  }

  // RANDOM
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const imgs = getImages().filter(i => i.style.display !== "none");
      if (!imgs.length) return;
      const img = imgs[Math.floor(Math.random() * imgs.length)];
      img.scrollIntoView({ behavior: "smooth", block: "center" });
      openViewer(img.src);
    });
  }

  // VIEWER (delegation)
  if (gallery) {
    gallery.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      openViewer(img.src);
    });
  }

  if (viewer) viewer.addEventListener("click", closeViewer);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeViewer());

  // NAV
  if (withiaBtn) withiaBtn.addEventListener("click", () => location.href = "withia.html");

  // HEADER hide on scroll
  if (topbar) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 100) topbar.classList.add("hide");
      else topbar.classList.remove("hide");
      lastScroll = current;
    });
  }

  // AUTH+ROLE (SIMPLE : un seul handler, on change juste la cible)
  let loginTarget = "login.html";

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      location.href = loginTarget;
    });
  }

  if (addBtn) {
    addBtn.style.display = "none";
    addBtn.addEventListener("click", () => location.href = "upload.html");
  }

  async function refreshAuthUI() {
    const { data: { session } } = await sb.auth.getSession();

    if (!session || !session.user) {
      if (loginBtn) loginBtn.textContent = "Login";
      loginTarget = "login.html";
      if (addBtn) addBtn.style.display = "none";
      return;
    }

    if (loginBtn) loginBtn.textContent = "Compte";
    loginTarget = "account.html";

    if (!addBtn) return;
    addBtn.style.display = "none";

    const { data: profile, error } = await sb
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("profiles error:", error);
      return;
    }

    if (profile && (profile.role === "admin" || profile.role === "contributor")) {
      addBtn.style.display = "inline-flex";
    }
  }

  refreshAuthUI();
  sb.auth.onAuthStateChange(() => refreshAuthUI());
});
