const search = document.getElementById("search");
const randomBtn = document.getElementById("randomBtn");

function getImages() {
  return document.querySelectorAll("#gallery img");
}

// 🔍 Recherche
search.addEventListener("input", () => {
  const value = search.value.toLowerCase().trim();
  const words = value.split(" ").filter(w => w.length > 0);

  getImages().forEach(img => {
    const tags = img.dataset.tags.toLowerCase();

    const match = words.every(word => tags.includes(word));
    img.style.display = match ? "block" : "none";
  });
});

// 🎲 Random
randomBtn.addEventListener("click", () => {
  const visibleImages = Array.from(getImages()).filter(
    img => img.style.display !== "none"
  );

  if (visibleImages.length === 0) return;

  const randomImage =
    visibleImages[Math.floor(Math.random() * visibleImages.length)];

  randomImage.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});
