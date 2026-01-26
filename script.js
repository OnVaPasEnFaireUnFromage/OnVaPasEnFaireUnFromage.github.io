document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  const sb = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  const search = document.getElementById("search");
  const randomBtn = document.getElementById("randomBtn");
  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");
  const loginBtn = document.getElementById("loginBtn");
  const withiaBtn = document.getElementById("withiaBtn");
  const addBtn = document.getElementById("addBtn");
  const header = document.querySelector("header");

  function getImages() {
    return Array.from(document.querySelectorAll("#gallery img"));
  }

  /* 🔍 SEARCH */
  if (search) {
    search.addEventListener("input", () => {
      const value = search.value.toLowerCase().trim();
      const words = value.split(" ").filter(Boolean);

      getImages().forEach(img => {
        const tags = (img.dataset.tags || "").toLowerCase();
        const match = words.every(word => tags.includes(word));
        img.style.display = match ? "block" : "none";
      });
    });
  }

  /* 🎲 RANDOM + open viewer */
  if (randomBtn && viewer && viewerImg) {
    randomBtn.addEventListener("click", () => {
      const visibleImages = getImages().filter(img => img.style.display !== "none");
      if (!visibleImages.length) return;

      const img = visibleImages[Math.floor(Math.random() * visibleImages.length)];
      img.scrollIntoView({ behavior: "smooth", block: "center" });

      viewerImg.src = img.src;
      viewer.style.display = "flex";
    });
  }

  /* 🖼️ CLICK IMAGE -> viewer */
  if (viewer && viewerImg) {
    getImages().forEach(img => {
      img.addEventListener("click", () => {
        viewerImg.src = img.src;
        viewer.style.display = "flex";
      });
    });

    viewer.addEventListener("click", () => {
      viewer.style.display = "none";
      viewerImg.src = "";
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        viewer.style.display = "none";
        viewerImg.src = "";
      }
    });
  }

  /* 🔗 NAV BUTTONS */
  if (withiaBtn) {
    withiaBtn.addEventListener("click", () => {
      window.location.href = "withia.html";
    });
  }

  /* 👇 HEADER HIDE ON SCROLL */
  if (header) {
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add("hide");
      } else {
        header.classList.remove("hide");
      }

      lastScroll = currentScroll;
    });
  }

  /* ➕ upload button */
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      window.location.href = "upload.html";
    });
  }

  /* 🔐 AUTH UI: Login -> Compte */
  async function updateAuthUI() {
    if (!sb || !loginBtn) return;

    const { data: { session } } = await sb.auth.getSession();

    if (session && session.user) {
      loginBtn.textContent = "Compte";
      loginBtn.onclick = () => (window.location.href = "account.html");
    } else {
      loginBtn.textContent = "Login";
      loginBtn.onclick = () => (window.location.href = "login.html");
    }
  }

  /* 🛡️ ROLES: show ➕ if admin/contributor */
  async function checkRole() {
    if (!sb || !addBtn) return;

    addBtn.style.display = "none";

    const { data: { session } } = await sb.auth.getSession();
    if (!session || !session.user) return;

    const { data: profile, error } = await sb
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Erreur profiles:", error);
      return;
    }

    if (profile && (profile.role === "admin" || profile.role === "contributor")) {
      addBtn.style.display = "block";
    }
  }

  updateAuthUI();
  checkRole();

  /* 🔄 si login/logout arrive sans recharger */
  if (sb) {
    sb.auth.onAuthStateChange(() => {
      updateAuthUI();
      checkRole();
    });
  }
});
