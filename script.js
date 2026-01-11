const search = document.getElementById("search");
const randomBtn = document.getElementById("randomBtn");

function getImages() {
  return document.querySelectorAll("#gallery img");
}

search.addEventListener("input", () => {
  const value = search.value.toLowerCase().trim();
  const words = value.split(" ").filter(w => w.length > 0);

  getImages().forEach(img => {
    const tags = img.dataset.tags.toLowerCase();

    const match = words.every(word => tags.includes(word));
    img.style.display = match ? "block" : "none";
  });
});

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

const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");

document.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest("#gallery")) {
    viewerImg.src = e.target.src;
    viewer.style.display = "flex";
  }

  if (e.target === viewer) {
    viewer.style.display = "none";
    viewerImg.src = "";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    viewer.style.display = "none";
    viewerImg.src = "";
  }
});
