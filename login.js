const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGpxYXhrYnZ6aWRrcnpiY2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4OTA3MDcsImV4cCI6MjA4NDQ2NjcwN30.9lBgfkJMCLk2D-gXjxj9bV5b5x-HZxY_cEBrdlsExBw";

console.log("login.js chargé");
console.log(window.supabase);

const sb = window.supabase.createClient(
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
  console.log("CLICK LOGIN");

  if (!email.value || !password.value) {
    showMsg("Champs manquants", "err");
    return;
  }

  setLoading(true);

  const { data, error } = await sb.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value
  });

  setLoading(false);

  console.log("LOGIN data:", data);
  console.log("LOGIN error:", error);

  if (error) {
    showMsg(error.message, "err");
    return;
  }

  const { data: sessionData } = await sb.auth.getSession();
  console.log("SESSION:", sessionData.session);

  showMsg("Connecté ✅", "ok");

  setTimeout(() => {
    location.href = "withoutia.html"; // mets la page qui existe chez toi
  }, 700);
};

signupBtn.onclick = async () => {
  console.log("CLICK SIGNUP");
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

loginBtn.onclick = () => {
  alert("login cliqué");
};
