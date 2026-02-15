const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
const SUPABASE_ANON_KEY = "TA_ANON_KEY"; // garde la tienne

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const urlInput = document.getElementById("imgUrl");
const tagsInput = document.getElementById("imgTags");
const uploadBtn = document.getElementById("uploadBtn");
const msg = document.getElementById("msg");

function show(text, color = "white") {
  msg.textContent = text;
  msg.style.color = color;
}

uploadBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  const tags = tagsInput.value.trim();

  if (!url || !tags) {
    show("Champs manquants", "red");
    return;
  }

  // 1) session ?
  const { data: sessData, error: sessErr } = await sb.auth.getSession();
  console.log("SESSION:", sessData, sessErr);

  if (!sessData?.session) {
    show("Pas connecté → redirection", "orange");
    setTimeout(() => (location.href = "login.html"), 500);
    return;
  }

  // 2) insert
  const payload = { url, tags };
  console.log("INSERT payload:", payload);

  const { data, error } = await sb.from("images").insert(payload).select();

  console.log("INSERT data:", data);
  console.log("INSERT error:", error);

  if (error) {
    show("Erreur upload: " + (error.message || "inconnue"), "red");
    return;
  }

  show("Posté ✅", "lime");
  urlInput.value = "";
  tagsInput.value = "";
});
