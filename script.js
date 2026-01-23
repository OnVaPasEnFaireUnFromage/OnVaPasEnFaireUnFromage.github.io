const search = document.getElementById("search");
const randomBtn = document.getElementById("randomBtn");
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");

function getImages() {
  return Array.from(document.querySelectorAll("#gallery img"));
}


search.addEventListener("input", () => {
  const value = search.value.toLowerCase().trim();
  const words = value.split(" ").filter(w => w);

  getImages().forEach(img => {
    const tags = img.dataset.tags.toLowerCase();
    const match = words.every(word => tags.includes(word));
    img.style.display = match ? "block" : "none";
  });
});

randomBtn.addEventListener("click", () => {
  const visibleImages = getImages().filter(
    img => img.style.display !== "none"
  );

  if (!visibleImages.length) return;

  const img = visibleImages[
    Math.floor(Math.random() * visibleImages.length)
  ];

  img.scrollIntoView({ behavior: "smooth", block: "center" });
  viewerImg.src = img.src;
  viewer.style.display = "flex";
});

getImages().forEach(img => {
  img.addEventListener("click", () => {
    viewerImg.src = img.src;
    viewer.style.display = "flex";
  });
});


viewer.addEventListener("click", () => {
  viewer.style.display = "none";
  viewerImg.src = "";
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    viewer.style.display = "none";
    viewerImg.src = "";
  }
});
const iaBtn = document.getElementById("iaBtn");

loginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});

withiaBtn.addEventListener("click", () => {
  window.location.href = "withia.html";
});

let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll && currentScroll > 100) {
    // scroll vers le bas
    header.classList.add("hide");
  } else {
    // scroll vers le haut
    header.classList.remove("hide");
  }

  lastScroll = currentScroll;
});
