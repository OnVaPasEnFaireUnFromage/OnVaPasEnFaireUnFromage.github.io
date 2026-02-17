document.addEventListener("DOMContentLoaded", () => {
  // ====== SUPABASE ======
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  if (!window.supabase) {
    console.error("Supabase SDK non chargé. Vérifie le <script src='...supabase...'> AVANT script.js");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ====== ELEMENTS ======
  const searchEl = document.getElementById("search");
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

  // ====== SEARCH ======
  if (searchEl) {
    searchEl.addEventListener("input", () => {
      const value = searchEl.value.toLowerCase().trim();
      const words = value.split(" ").filter(Boolean);

      getImages().forEach(img => {
        const tags = (img.dataset.tags || "").toLowerCase();
        const ok = words.every(w => tags.includes(w));
        img.style.display = ok ? "block" : "none";
      });
    });
  }

  // ====== VIEWER ======
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

  if (gallery) {
    // event delegation (plus fiable)
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

  // ====== RANDOM ======
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const visible = getImages().filter(img => img.style.display !== "none");
      if (!visible.length) return;

      const img = visible[Math.floor(Math.random() * visible.length)];
      img.scrollIntoView({ behavior: "smooth", block: "center" });
      openViewer(img.src);
    });
  }

  // ====== NAV BUTTONS ======
  if (withiaBtn) {
    withiaBtn.addEventListener("click", () => {
      location.href = "withia.html";
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      location.href = "login.html";
    });
  }

  // ====== ➕ ALWAYS VISIBLE + REDIRECTS ======
  if (addBtn) {
    addBtn.style.display = "inline-flex";

    addBtn.addEventListener("click", async () => {
      const { data: { session } } = await sb.auth.getSession();

      if (!session?.user) {
        location.href = "connectetoi.html";
        return;
      }

      const { data: profile, error } = await sb
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("profiles error:", error);
        location.href = "paslesperms.html";
        return;
      }

      const role = profile?.role || "user";
      const allowed = (role === "admin" || role === "contributor");

      if (!allowed) {
        location.href = "paslesperms.html";
        return;
      }

      location.href = "upload.html";
    });
  }

  console.log("✅ script.js OK (no redeclare, Supabase OK)");
});

  // ====== HEADER HIDE ON SCROLL ======
  const header = document.querySelector("header");
  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const current = window.scrollY;

      if (current > lastScrollY && current > 120) {
        header.classList.add("hide");   // scroll down
      } else {
        header.classList.remove("hide"); // scroll up
      }

      lastScrollY = current;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }
