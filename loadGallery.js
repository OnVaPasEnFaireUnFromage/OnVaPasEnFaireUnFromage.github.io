document.addEventListener("DOMContentLoaded", async () => {
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  if (!window.supabase) {
    console.error("Supabase SDK non chargé (CDN).");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  // Détecte automatiquement la section
  const isWithIA = location.pathname.toLowerCase().includes("withia");
  const table = isWithIA ? "images_withia" : "images_withoutia";

  // Nettoie les <img> vides (ceux avec src="")
  gallery.querySelectorAll("img").forEach(img => {
    if (!img.getAttribute("src")) img.remove();
  });

  const { data, error } = await sb
    .from(table)
    .select("id,url,tags,description,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lecture table:", error);
    return;
  }

  // Injecte les images venant de Supabase
  for (const row of data || []) {
    const img = document.createElement("img");
    img.src = row.url;
    img.alt = row.description || "";
    img.dataset.tags = row.tags || "";
    gallery.prepend(img);
  }

  console.log(`✅ Galerie chargée depuis ${table}:`, (data || []).length, "images");
});