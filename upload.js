const SUPABASE_URL = "https://waljqaxkbvzidkrzbcbz.supabase.co";
const SUPABASE_ANON_KEY = "TA_ANON_KEY";

const sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const imgUrl = document.getElementById("imgUrl");
const tags = document.getElementById("tags");
const desc = document.getElementById("desc");
const uploadBtn = document.getElementById("uploadBtn");
const msg = document.getElementById("msg");

function showMsg(text, color="white"){
  msg.textContent = text;
  msg.style.color = color;
}

uploadBtn.onclick = async () => {

  if(!imgUrl.value){
    showMsg("URL manquante","red");
    return;
  }

  const { data: { session } } = await sb.auth.getSession();

  if(!session){
    location.href = "connectetoi.html";
    return;
  }

  const { error } = await sb
    .from("images")
    .insert({
      url: imgUrl.value,
      tags: tags.value,
      description: desc.value,
      user_id: session.user.id
    });

  if(error){
    showMsg("Erreur upload","red");
    console.error(error);
  }else{
    showMsg("Image publiée ✅","lime");
    imgUrl.value="";
    tags.value="";
    desc.value="";
  }

};
