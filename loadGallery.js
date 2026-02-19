document.addEventListener("DOMContentLoaded", async () => {

  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30";

  if (!window.supabase) return;

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const path = location.pathname.toLowerCase();
  let table = null;

  if (path.includes("withia")) table = "images_withia";
  if (path.includes("withoutia")) table = "images_withoutia";
  if (!table) return;

  const { data, error } = await sb
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  gallery.innerHTML = "";

  data.forEach(img => {
    const el = document.createElement("img");
    el.src = img.url;
    el.dataset.tags = img.tags || "";
    gallery.appendChild(el);
  });

});