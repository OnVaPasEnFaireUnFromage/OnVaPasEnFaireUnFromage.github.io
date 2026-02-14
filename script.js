document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "TON_ANON_KEY_ICI"; // garde la tienne

  if (!window.supabase) {
    console.error("Supabase SDK pas chargé (CDN manquant).");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const search = document.getElementById("search");
  const randomBtn = document.getElementById("randomBtn");
  const loginBtn = document.getElementById("loginBtn");
  const withiaBtn = document.getElementById("withiaBtn");
  const withoutiaBtn = document.getElementById("withoutiaBtn");
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

  if (search) {
    search.addEventListener("input", () => {
      const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      getImages().forEach(img => {
        const tags = (img.dataset.tags || "").toLowerCase();
        const ok = words.every(w => tags.includes(w));
        img.style.display = ok ? "" : "none";
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

  if (withiaBtn) withiaBtn.addEventListener("click", () => location.href = "withia.html");
  if (withoutiaBtn) withoutiaBtn.addEventListener("click", () => location.href = "withoutia.html");

  if (addBtn) {
    addBtn.style.display = "none";
    addBtn.addEventListener("click", () => location.href = "upload.html");
  }

  let loginTarget = "login.html";

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      location.href = loginTarget;
    });
  }

  async function refreshAuthUI() {
    const { data: { session }, error } = await sb.auth.getSession();
    if (error) console.error("getSession error:", error);

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
      addBtn.style.display = "inline-flex";
    }
  }

  refreshAuthUI();
  sb.auth.onAuthStateChange(() => refreshAuthUI());
});
