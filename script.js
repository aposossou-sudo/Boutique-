const loader = document.getElementById("loader");

function showLoader() {
  loader.style.display = "block";
  loader.innerHTML = '<div class="bar"></div>';
  setTimeout(() => loader.style.display = "none", 1000);
}

document.addEventListener("click", showLoader);

async function chargerProduits() {
  const res = await fetch("/api/produits");
  const produits = await res.json();
  const container = document.getElementById("produits");
  if (!container) return;

  container.innerHTML = "";
  produits.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <img src="${p.image}">
      <h3>${p.nom}</h3>
      <p>${p.prix}</p>
      <button onclick="window.location='https://wa.me/2290167924076'">
        Commander sur WhatsApp
      </button>
    `;
    container.appendChild(card);
  });
}

async function chargerVideo() {
  const res = await fetch("/api/videos");
  const videos = await res.json();
  if (videos[0]) {
    const video = document.getElementById("video");
    if (video) video.src = videos[0];
  }
}

chargerProduits();
chargerVideo();
