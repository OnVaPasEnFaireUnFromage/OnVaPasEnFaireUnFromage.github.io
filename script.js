document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  if (!window.supabase) {
    console.error("Supabase SDK non chargé. Vérifie le CDN avant script.js");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const search = document.getElementById("search");
  const randomBtn = document.getElementById("randomBtn");
  const withiaBtn = document.getElementById("withiaBtn");
  const withoutiaBtn = document.getElementById("withoutiaBtn");
  const addBtn = document.getElementById("addBtn");

  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");
  const gallery = document.getElementById("gallery");

  const header = document.querySelector("header");

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

  // SEARCH
  if (search) {
    search.addEventListener("input", () => {
      const words = search.value.toLowerCase().trim().split(" ").filter(Boolean);
      getImages().forEach(img => {
        const tags = (img.dataset.tags || "").toLowerCase();
        img.style.display = words.every(w => tags.includes(w)) ? "block" : "none";
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

  // VIEWER
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
  if (withoutiaBtn) withoutiaBtn.addEventListener("click", () => location.href = "withoutia.html");
  if (addBtn) addBtn.addEventListener("click", () => location.href = "upload.html");

  // HEADER hide on scroll
  if (header) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) header.classList.add("hide");
      else header.classList.remove("hide");
      lastScroll = currentScroll;
    });
  }

  // 🔥 reset safe: on prend le bouton ACTUEL dans le DOM à chaque fois
  function resetLoginButtonSafe() {
    const current = document.getElementById("loginBtn");
    if (!current) return null;
    const clone = current.cloneNode(true);
    current.replaceWith(clone);
    return document.getElementById("loginBtn");
  }

  async function updateUI() {
    const loginBtnFresh = resetLoginButtonSafe();
    if (!loginBtnFresh) return;

    // default
    if (addBtn) addBtn.style.display = "none";

    const { data: { session }, error } = await sb.auth.getSession();
    if (error) console.error("getSession error:", error);

    if (!session || !session.user) {
      loginBtnFresh.textContent = "Login";
      loginBtnFresh.addEventListener("click", () => location.href = "login.html");
      return;
    }

    loginBtnFresh.textContent = "Compte";
    loginBtnFresh.addEventListener("click", () => location.href = "account.html");

    // role => show ➕
    if (!addBtn) return;

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
      addBtn.style.display = "block";
    }
  }

  updateUI();
  sb.auth.onAuthStateChange(() => updateUI());
});