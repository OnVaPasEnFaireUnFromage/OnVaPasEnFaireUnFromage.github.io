const search = document.getElementById("search");
const randomBtn = document.getElementById("randomBtn");
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");

function getImages() {
  return Array.from(document.querySelectorAll("#gallery img"));
}


search.addEventListener("input", () => {
  const value = search.value.toLowerCase().trim();
  const words = value.split(" ").filter(w => w);

  getImages().forEach(img => {
    const tags = img.dataset.tags.toLowerCase();
    const match = words.every(word => tags.includes(word));
    img.style.display = match ? "block" : "none";
  });
});

randomBtn.addEventListener("click", () => {
  const visibleImages = getImages().filter(
    img => img.style.display !== "none"
  );

  if (!visibleImages.length) return;

  const img = visibleImages[
    Math.floor(Math.random() * visibleImages.length)
  ];

  img.scrollIntoView({ behavior: "smooth", block: "center" });
  viewerImg.src = img.src;
  viewer.style.display = "flex";
});

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

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    viewer.style.display = "none";
    viewerImg.src = "";
  }
});

const loginBtn = document.getElementById("loginBtn");
const withiaBtn = document.getElementById("withiaBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

if (withiaBtn) {
  withiaBtn.addEventListener("click", () => {
    window.location.href = "withia.html";
  });
}


let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll && currentScroll > 100) {
    // scroll vers le bas
    header.classList.add("hide");
  } else {
    // scroll vers le haut
    header.classList.remove("hide");
  }

  lastScroll = currentScroll;
});

// ➕ toujours visible, et redirections au clic
const addBtn = document.getElementById("addBtn");

if (addBtn) {
  addBtn.style.display = "inline-flex"; // toujours visible

  addBtn.addEventListener("click", async () => {
    // si ton client s'appelle pas "sb", change ici
    const { data: { session } } = await supabase.auth.getSession();

    // pas connecté -> page connecte toi
    if (!session?.user) {
      window.location.href = "cotoi.html";
      return;
    }

    // connecté -> check role
    const { data: profile, error } = await sb
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("profiles error:", error);
      window.location.href = "paslesperms.html";
      return;
    }

    const role = profile?.role || "user";
    const allowed = (role === "admin" || role === "contributor");

    if (!allowed) {
      window.location.href = "paslesperms.html";
      return;
    }

    // autorisé
    window.location.href = "upload.html";
  });
}

(function () {
  console.log("✅ script.js chargé (debug ➕)");

  const addBtn = document.getElementById("addBtn");
  console.log("addBtn =", addBtn);

  if (!addBtn) {
    console.error("❌ Pas de bouton #addBtn dans cette page.");
    return;
  }

  // On force visible et on prouve que le clic marche
  addBtn.style.display = "inline-flex";
  addBtn.style.pointerEvents = "auto";

  addBtn.addEventListener("click", async () => {
    console.log("✅ CLICK ➕ détecté");

    // 1) Supabase SDK chargé ?
    if (!window.supabase) {
      alert("Supabase SDK pas chargé (CDN manquant).");
      console.error("❌ window.supabase absent");
      return;
    }

    // 2) Client SB: soit tu as déjà sb global, soit on le recrée ici
    const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

    const sb2 = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: { session }, error: sessErr } = await sb2.auth.getSession();
    console.log("session =", session, "err =", sessErr);

    if (!session?.user) {
      console.log("➡️ pas connecté -> connectetoi.html");
      location.href = "connectetoi.html";
      return;
    }

    const { data: profile, error: profErr } = await sb2
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    console.log("profile =", profile, "err =", profErr);

    if (profErr) {
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

  console.log("✅ Listener ➕ installé");
})();
