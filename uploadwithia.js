<script>
document.addEventListener("DOMContentLoaded", async () => {

  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  const gallery = document.getElementById("gallery");

  const section = "withia"; // 👈 IMPORTANT

  const { data, error } = await sb
    .from("images")
    .select("url,tags,description,created_at")
    .eq("section", section)
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
    el.alt = img.description || "";
    gallery.appendChild(el);
  });

});
</script>
