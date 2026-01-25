document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  if (!window.supabase) {
    console.error("Supabase SDK non chargé");
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

  /* ---------- GALLERY ---------- */

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

  if (search) {
    search.addEventListener("input", () => {
      const words = search.value.toLowerCase().trim().split(" ").filter(Boolean);
      getImages().forEach(img => {
        const tags = (img.dataset.tags || "").toLowerCase();
        img.style.display = words.every(w => tags.includes(w)) ? "block" : "none";
      });
    });
  }

  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const imgs = getImages().filter(i => i.style.display !== "none");
      if (!imgs.length) return;
      const img = imgs[Math.floor(Math.random() * imgs.length)];
      img.scrollIntoView({ behavior: "smooth", block: "center" });
      openViewer(img.src);
    });
  }

  if (gallery) {
    gallery.addEventListener("click", e => {
      const img = e.target.closest("img");
      if (img) openViewer(img.src);
    });
  }

  if (viewer) viewer.addEventListener("click", closeViewer);
  document.addEventListener("keydown", e => e.key === "Escape" && closeViewer());

  if (withiaBtn) withiaBtn.addEventListener("click", () => location.href = "withia.html");
  if (addBtn) addBtn.addEventListener("click", () => location.href = "upload.html");

  /* ---------- AUTH UI (FIX) ---------- */

  function resetLoginButton() {
    if (!loginBtn) return;
    const clone = loginBtn.cloneNode(true);
    loginBtn.replaceWith(clone);
    return document.getElementById("loginBtn");
  }

  async function updateUI() {
    const freshLoginBtn = resetLoginButton();
    if (!freshLoginBtn) return;

    const { data: { session } } = await sb.auth.getSession();

    if (!session) {
      freshLoginBtn.textContent = "Login";
      freshLoginBtn.addEventListener("click", () => {
        location.href = "login.html";
      });
      if (addBtn) addBtn.style.display = "none";
      return;
    }

    freshLoginBtn.textContent = "Compte";
    freshLoginBtn.addEventListener("click", () => {
      location.href = "account.html";
    });

    if (!addBtn) return;
    addBtn.style.display = "none";

    const { data: profile } = await sb
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile && (profile.role === "admin" || profile.role === "contributor")) {
      addBtn.style.display = "block";
    }
  }

  updateUI();
  sb.auth.onAuthStateChange(() => updateUI());
});
