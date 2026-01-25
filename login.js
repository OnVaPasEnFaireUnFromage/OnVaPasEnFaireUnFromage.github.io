document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

  console.log("login.js chargé");
  console.log("supabase global:", window.supabase);

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const forgotBtn = document.getElementById("forgot");
  const msg = document.getElementById("msg");

  function showMsg(text, type) {
    msg.className = type;
    msg.textContent = text;
    msg.style.display = "block";
  }

  function setLoading(state) {
    loginBtn.disabled = state;
    signupBtn.disabled = state;
  }

  loginBtn.addEventListener("click", async () => {
    console.log("CLICK LOGIN");

    const e = email.value.trim();
    const p = password.value;

    if (!e || !p) {
      showMsg("Champs manquants", "err");
      return;
    }

    setLoading(true);

    const { data, error } = await sb.auth.signInWithPassword({
      email: e,
      password: p
    });

    setLoading(false);

    console.log("LOGIN data:", data);
    console.log("LOGIN error:", error);

    if (error) {
      showMsg(error.message, "err");
      return;
    }

    showMsg("Connecté ✅", "ok");
    setTimeout(() => {
      location.href = "withoutia.html";
    }, 700);
  });

  signupBtn.addEventListener("click", async () => {
    console.log("CLICK SIGNUP");

    const e = email.value.trim();
    const p = password.value;

    if (!e || !p) {
      showMsg("Champs manquants", "err");
      return;
    }

    setLoading(true);

    const { error } = await sb.auth.signUp({
      email: e,
      password: p
    });

    setLoading(false);

    if (error) showMsg(error.message, "err");
    else showMsg("Compte créé ✅ (si confirmation OFF, tu peux te co direct)", "ok");
  });

  forgotBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const mail = email.value.trim();
    if (!mail) {
      showMsg("Entre ton email", "err");
      return;
    }

    const { error } = await sb.auth.resetPasswordForEmail(mail);

    if (error) showMsg(error.message, "err");
    else showMsg("Email envoyé ✅", "ok");
  });
});
