const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

if (!window.supabase) {
  alert("Supabase SDK pas chargé sur upload.html");
}

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const urlInput = document.getElementById("imgUrl");
const tagsInput = document.getElementById("imgTags");
const descInput = document.getElementById("desc"); // si t'as pas, ça casse pas
const uploadBtn = document.getElementById("uploadBtn");
const msg = document.getElementById("msg");

function show(text, type = "info") {
  msg.textContent = text;
  msg.style.color = type === "err" ? "red" : (type === "ok" ? "lime" : "white");
}

async function guardRole() {
  const { data: { session }, error: sessErr } = await sb.auth.getSession();
  console.log("getSession:", session, sessErr);

  if (!session?.user) {
    location.href = "connectetoi.html";
    return null;
  }

  const { data: profile, error: profErr } = await sb
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  console.log("profile:", profile, profErr);

  if (profErr) {
    location.href = "paslesperms.html";
    return null;
  }

  const role = profile?.role || "user";
  const allowed = (role === "admin" || role === "contributor");
  if (!allowed) {
    location.href = "paslesperms.html";
    return null;
  }

  return session;
}

(async () => {
  show("Vérification des permissions...");
  const session = await guardRole();
  if (session) show("OK ✅ Tu peux publier.", "ok");
})();

uploadBtn.addEventListener("click", async () => {
  const url = (urlInput?.value || "").trim();
  const tags = (tagsInput?.value || "").trim();
  const description = (descInput?.value || "").trim();

  if (!url) {
    show("URL manquante", "err");
    return;
  }

  uploadBtn.disabled = true;
  show("Publication...");

  const session = await guardRole();
  if (!session) {
    uploadBtn.disabled = false;
    return;
  }

  const payload = {
    url,
    tags: tags || null,
    user_id: session.user.id
  };

  // si ta table a une colonne description, on l'envoie
  if (description) payload.description = description;

  console.log("INSERT payload:", payload);

  const { data, error } = await sb
    .from("images")
    .insert(payload)
    .select();

  console.log("INSERT result:", data, error);

  uploadBtn.disabled = false;

  if (error) {
    show("Erreur: " + error.message, "err");
    return;
  }

  show("Publié ✅", "ok");
  urlInput.value = "";
  if (tagsInput) tagsInput.value = "";
  if (descInput) descInput.value = "";
});
