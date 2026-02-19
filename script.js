document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  // ===== ELEMENTS (compat multi pages) =====
  const searchEl = document.getElementById("search");
  const randomBtn = document.getElementById("randomBtn");

  const withiaBtn = document.getElementById("withiaBtn");
  const withoutiaBtn = document.getElementById("withoutiaBtn");

  // Compte peut s'appeler loginBtn ou compteBtn selon tes pages
  const compteBtn =
    document.getElementById("compteBtn") || document.getElementById("loginBtn");

  const addBtn = document.getElementById("addBtn");

  const gallery = document.getElementById("gallery");
  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewerImg");

  // ===== UTILS =====
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

  // ===== SEARCH =====
  if (searchEl) {
    searchEl.addEventListener("input", () => {
      const value = searchEl.value.toLowerCase().trim();
      const words = value.split(/\s+/).filter(Boolean);

      getImages().forEach((img) => {
        const tags = (img.dataset.tags || "").toLowerCase();
        const ok = words.every((w) => tags.includes(w));
        img.style.display = ok ? "block" : "none";
      });
    });
  }

  // ===== VIEWER (click image) =====
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

  // ===== RANDOM =====
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const visible = getImages().filter(
        (img) => img.style.display !== "none" && img.src
      );
      if (!visible.length) return;

      const img = visible[Math.floor(Math.random() * visible.length)];
      img.scrollIntoView({ behavior: "smooth", block: "center" });
      openViewer(img.src);
    });
  }

  // ===== NAV BUTTONS =====
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

  // ===== SUPABASE INIT (wait a bit if CDN loaded after) =====
  function waitForSupabase(maxMs = 3000) {
    return new Promise((resolve) => {
      const start = Date.now();
      const timer = setInterval(() => {
        if (window.supabase && typeof window.supabase.createClient === "function") {
          clearInterval(timer);
          resolve(true);
        } else if (Date.now() - start > maxMs) {
          clearInterval(timer);
          resolve(false);
        }
      }, 50);
    });
  }

  let sb = null;

  async function initSupabase() {
    const ok = await waitForSupabase(3000);
    if (!ok) {
      console.warn("Supabase SDK pas chargé (ou trop tard).");
      return null;
    }
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return sb;
  }

  // ===== COMPTE BUTTON =====
if (compteBtn) {
  compteBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // si supabase pas prêt → login direct
    if (!sb) {
      location.href = "login.html";
      return;
    }

    const { data: { session } = {} } = await sb.auth.getSession();

    if (!session?.user) {
      location.href = "login.html";
    } else {
      location.href = "account.html";
    }
  });
}
  // ===== ADD BUTTON (always visible, redirect based on auth + role) =====
  async function handleAddClick() {
    if (!sb) {
      location.href = "login.html";
      return;
    }

    const { data: { session } = {} } = await sb.auth.getSession();

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
    const allowed = role === "admin" || role === "contributor";

    if (!allowed) {
      location.href = "paslesperms.html";
      return;
    }

    // Choix auto de la page upload selon la section où t'es
    const path = (location.pathname || "").toLowerCase();
    if (path.includes("withia")) location.href = "uploadwithia.html";
    else location.href = "uploadwithoutia.html";
  }

  // ===== HEADER HIDE ON SCROLL =====
  const header = document.querySelector("header");
  if (header) {
    let last = window.scrollY;
    let hidden = false;
    let ticking = false;

    const run = () => {
      const y = window.scrollY;
      const down = y > last;
      const up = y < last;

      if (y <= 5) {
        header.classList.remove("hide");
        hidden = false;
      } else if (down && y > 80 && !hidden) {
        header.classList.add("hide");
        hidden = true;
      } else if (up && hidden) {
        header.classList.remove("hide");
        hidden = false;
      }

      last = y;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(run);
        }
      },
      { passive: true }
    );
  }

  // ===== START =====
  (async () => {
    await initSupabase();

    // Compte
    if (compteBtn) {
      compteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleCompteClick();
      });
    }

    // ➕ toujours visible
    if (addBtn) {
      addBtn.style.display = "inline-flex";
      addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleAddClick();
      });
    }

    console.log("✅ script.js OK");
  })();
});
