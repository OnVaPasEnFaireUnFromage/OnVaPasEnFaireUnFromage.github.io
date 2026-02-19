const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
const SUPABASE_ANON_KEY = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const url = document.getElementById("url");
const tags = document.getElementById("tags");
const description = document.getElementById("description");
const msg = document.getElementById("msg");

document.getElementById("publish").onclick = async () => {

  const { error } = await sb.from("images_withia").insert({
    url: url.value,
    tags: tags.value,
    description: description.value
  });

  if (error) {
    msg.textContent = "Erreur upload ❌";
    console.error(error);
  } else {
    msg.textContent = "Publié ✅";
  }
};
