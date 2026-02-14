const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

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

loginBtn.onclick = async () => {
  if (!email.value || !password.value) {
    showMsg("Champs manquants", "err");
    return;
  }

  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  setLoading(false);

  if (error) showMsg(error.message, "err");
  else {
    showMsg("Connecté", "ok");
    setTimeout(() => location.href = "index.html", 700);
  }
};

signupBtn.onclick = async () => {
  if (!email.value || !password.value) {
    showMsg("Champs manquants", "err");
    return;
  }

  setLoading(true);
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  });
  setLoading(false);

  if (error) showMsg(error.message, "err");
  else showMsg("Compte créé, vérifie tes mails", "ok");
};

forgotBtn.onclick = async e => {
  e.preventDefault();
  if (!email.value) {
    showMsg("Entre ton email", "err");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email.value);
  if (error) showMsg(error.message, "err");
  else showMsg("Email envoyé", "ok");
};
