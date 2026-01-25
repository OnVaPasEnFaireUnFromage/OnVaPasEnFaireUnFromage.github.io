document.addEventListener("DOMContentLoaded", () => {

  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  const search = document.getElementById("search");
  const randomBtn = document.getElementById("randomBtn");
  const loginBtn = document.getElementById("loginBtn");
  const withiaBtn = document.getElementById("withiaBtn");
  const addBtn = document.getElementById("addBtn");

  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");

  function getImages() {
    return Array.from(document.querySelectorAll("#gallery img"));
  }

  /* SEARCH */
  if (search) {
    search.addEventListener("input", () => {
      const value = search.value.toLowerCase().trim();
      const words = value.split(" ").filter(Boolean);

      getImages().forEach(img => {
        const tags = (img.dataset.tags || "").toLowerCase();
        img.style.display = words.every(w => tags.includes(w)) ? "block" : "none";
      });
    });
  }

  /* RANDOM */
  if (randomBtn) {
    randomBtn.onclick = () => {
      const imgs = getImages().filter(i => i.style.display !== "none");
      if (!imgs.length) return;

      const img = imgs[Math.floor(Math.random() * imgs.length)];
      img.scrollIntoView({ behavior: "smooth", block: "center" });

      viewerImg.src = img.src;
      viewer.style.display = "flex";
    };
  }

  /* VIEWER */
  getImages().forEach(img => {
    img.onclick = () => {
      viewerImg.src = img.src;
      viewer.style.display = "flex";
    };
  });

  if (viewer) {
    viewer.onclick = () => {
      viewer.style.display = "none";
      viewerImg.src = "";
    };
  }

  /* NAV */
  if (withiaBtn) {
    withiaBtn.onclick = () => location.href = "withia.html";
  }

  if (addBtn) {
    addBtn.onclick = () => location.href = "upload.html";
  }

  /* AUTH UI */
  async function updateUI() {
    const { data: { session } } = await sb.auth.getSession();

    if (!session) {
      loginBtn.textContent = "Login";
      loginBtn.onclick = () => location.href = "login.html";
      addBtn.style.display = "none";
      return;
    }

    loginBtn.textContent = "Compte";
    loginBtn.onclick = () => location.href = "account.html";

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
