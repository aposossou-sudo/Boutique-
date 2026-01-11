const phone = "2290167924076";
const loader = document.getElementById("loader");

function showLoader() {
  loader.style.display = "block";
  loader.innerHTML = '<div class="bar"></div>';
  setTimeout(() => loader.style.display = "none", 1000);
}

document.addEventListener("click", showLoader);

function commander(nom, prix) {
  const msg = `Bonjour, je veux commander le produit ${nom} au prix de ${prix}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
}

async function chargerProduits() {
  const res = await fetch("/api/produits");
  const produits = await res.json();
  const container = document.getElementById("produits");
  if (!container) return;

  const badges = ["🔥 Best seller","⭐ Très demandé","💎 Offre limitée"];
  container.innerHTML = "";

  produits.forEach((p,i) => {
    const badge = badges[Math.floor(Math.random()*badges.length)];
    const div = document.createElement("div");
    div.className = "card";
    div.style.animationDelay = `${i*0.1}s`;
    div.innerHTML = `
      <span class="badge">${badge}</span>
      <img src="${p.image}">
      <h3>${p.nom}</h3>
      <p>${p.prix}</p>
      <button onclick="commander('${p.nom}','${p.prix}')">Commander</button>
    `;
    container.appendChild(div);
  });
}

async function chargerVideo() {
  const res = await fetch("/api/video");
  const data = await res.json();
  const video = document.getElementById("video");
  if (video && data.video) video.src = data.video;
}

async function ajouterProduit() {
  await fetch("/api/admin/produit", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      password: password.value,
      nom: nom.value,
      prix: prix.value,
      image: image.value
    })
  });
  alert("Produit ajouté");
}

async function ajouterVideo() {
  await fetch("/api/admin/video", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      password: password.value,
      video: videoInput.value
    })
  });
  alert("Vidéo ajoutée");
}

chargerProduits();
chargerVideo();
