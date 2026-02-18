document.addEventListener("DOMContentLoaded", () => {
  // ====== SUPABASE ======
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  const hasSupabase = !!window.supabase;
  if (!hasSupabase) {
    console.error("Supabase SDK non chargé. Vérifie le <script src='...supabase...'> AVANT script.js");
  }
  const sb = hasSupabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

  // ====== ELEMENTS ======
  const searchEl = document.getElementById("search");
  const randomBtn = document.getElementById("randomBtn");
  const compteBtn = document.getElementById("compteBtn");
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

      getImages().forEach((img) => {
        const tags = (img.dataset.tags || "").toLowerCase();
        const ok = words.every((w) => tags.includes(w));
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
    gallery.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      if (!img.src) return;
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
      const visible = getImages().filter((img) => img.style.display !== "none" && img.src);
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

  if (withoutiaBtn) {
    withoutiaBtn.addEventListener("click", () => { 
      location.href = "withoutia.html";
    });
  }

  if (Btn) {
    compteBtn.addEventListener("click", () => {
      location.href = "login.html";
    });
  }

  // ====== ➕ ALWAYS VISIBLE + REDIRECTS ======
  if (addBtn) {
    addBtn.style.display = "inline-flex";

    addBtn.addEventListener("click", async () => {
      // si supabase pas chargé -> on envoie sur login direct (évite crash)
      if (!sb) {
        location.href = "login.html";
        return;
      }

      const { data: { session } = {} } = await sb.auth.getSession();

      // pas connecté
      if (!session?.user) {
        location.href = "connectetoi.html";
        return;
      }

      // check role
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

  // ====== HEADER HIDE ON SCROLL (BÉTON) ======
  const header = document.querySelector("header");
  if (header) {
    let last = window.scrollY;
    let hidden = false;
    let ticking = false;

    const run = () => {
      const y = window.scrollY;
      const goingDown = y > last;
      const goingUp = y < last;

      if (y <= 5) {
        header.classList.remove("hide");
        hidden = false;
      } else if (goingDown && y > 80 && !hidden) {
        header.classList.add("hide");
        hidden = true;
      } else if (goingUp && hidden) {
        header.classList.remove("hide");
        hidden = false;
      }

      last = y;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    }, { passive: true });
  }


  console.log("✅ script.js OK");
});
