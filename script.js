const phone = "2290167924076";
const loader = document.getElementById("loader");

function showLoader() {
  loader.style.display = "flex";
  setTimeout(()=>loader.style.display="none",1500);
}

document.addEventListener("click", showLoader);

function demanderMotDePasse() {
  document.getElementById('login-modal').style.display = 'flex';
  document.getElementById('admin-login-pass').focus();
}

function closeLoginModal() {
  document.getElementById('login-modal').style.display = 'none';
  document.getElementById('admin-login-pass').value = '';
}

function validerLogin() {
  const pass = document.getElementById('admin-login-pass').value;
  if (pass === "kouame") {
    window.location = "admin.html";
  } else {
    alert("Mot de passe incorrect");
  }
}

function formatCFA(nombre){
  return new Intl.NumberFormat('fr-FR').format(nombre)+" FCFA";
}

function commander(nom, prix){
  const msg = `Bonjour, je veux commander ${nom} au prix de ${prix}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
}

async function chargerProduits() {
  const res = await fetch("/api/produits");
  const produits = await res.json();
  const container = document.getElementById("produits");
  const adminList = document.getElementById("listeProduits");
  
  if (container) {
    const badges = ["🔥 Best seller", "⭐ Très demandé", "💎 Offre limitée"];
    container.innerHTML = "";
    produits.forEach((p, i) => {
      const badge = badges[Math.floor(Math.random() * badges.length)];
      const div = document.createElement("div");
      div.className = "card";
      div.style.animationDelay = `${i * 0.05}s`;
      div.innerHTML = `
        <span class="badge">${badge}</span>
        <img src="${p.image}">
        <h3>${p.nom}</h3>
        <p>${formatCFA(p.prix)}</p>
        <button onclick="commander('${p.nom}','${formatCFA(p.prix)}')">Commander</button>
      `;
      container.appendChild(div);
    });
  }

  if (adminList) {
    adminList.innerHTML = "";
    produits.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${p.nom} - ${formatCFA(p.prix)}</span>
        <div>
          <button class="edit-btn" onclick="modifierProduit(${p.id}, '${p.nom}', ${p.prix})">Modifier</button>
          <button class="del-btn" onclick="supprimerProduit(${p.id})">Supprimer</button>
        </div>
      `;
      adminList.appendChild(li);
    });
  }
}

async function chargerVideos() {
  const res = await fetch("/api/videos");
  const videos = await res.json();
  const container = document.getElementById("video-gallery");
  const adminVideoList = document.getElementById("listeVideosAdmin");
  
  if (container) {
    container.innerHTML = "";
    if (videos.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; color: rgba(255,255,255,0.4);'>Aucune vidéo pour le moment. Ajoutez-en dans l'administration !</p>";
    }
    videos.forEach(v => {
      const div = document.createElement("div");
      div.className = "video-item";
      div.innerHTML = `
        <div class="video-preview" onclick="playVideo('${v.video}')">
          <span class="play-icon">▶️</span>
          <p>${v.titre}</p>
        </div>
      `;
      container.appendChild(div);
    });
  }

  if (adminVideoList) {
    adminVideoList.innerHTML = "";
    videos.forEach(v => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${v.titre}</span>
        <button class="del-btn" onclick="supprimerVideo(${v.id})">Supprimer</button>
      `;
      adminVideoList.appendChild(li);
    });
  }
}

function playVideo(src) {
  const player = document.getElementById('main-video-player');
  const modal = document.getElementById('video-modal');
  player.src = src;
  modal.style.display = 'flex';
}

function closeVideoModal() {
  const player = document.getElementById('main-video-player');
  const modal = document.getElementById('video-modal');
  player.pause();
  player.src = '';
  modal.style.display = 'none';
}

function showSection(id) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}

function openModal(onConfirm) {
  const modal = document.getElementById('password-modal');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const passInput = document.getElementById('admin-confirm-pass');
  
  modal.style.display = 'flex';
  passInput.value = '';
  passInput.focus();

  confirmBtn.onclick = () => {
    onConfirm(passInput.value);
    closeModal();
  };
}

function closeModal() {
  document.getElementById('password-modal').style.display = 'none';
}

async function supprimerProduit(id) {
  openModal(async (pass) => {
    const res = await fetch(`/api/admin/produit/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass })
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else chargerProduits();
  });
}

async function modifierProduit(id, ancienNom, ancienPrix) {
  const nouveauNom = prompt("Nouveau nom :", ancienNom);
  const nouveauPrix = prompt("Nouveau prix :", ancienPrix);
  if (!nouveauNom || !nouveauPrix) return;
  
  openModal(async (pass) => {
    const res = await fetch(`/api/admin/produit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass, nom: nouveauNom, prix: nouveauPrix })
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else chargerProduits();
  });
}

async function ajouterProduit() {
  const file = imageFile.files[0];
  const nameVal = document.getElementById('nom').value;
  const priceVal = document.getElementById('prix').value;
  if (!file || !nameVal || !priceVal) return alert("Veuillez remplir tous les champs");
  
  openModal(async (pass) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch("/api/admin/produit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: pass,
          nom: nameVal,
          prix: Number(priceVal),
          image: reader.result
        })
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else {
        alert("Produit ajouté");
        chargerProduits();
      }
    };
    reader.readAsDataURL(file);
  });
}

async function ajouterVideo() {
  const file = videoFile.files[0];
  const titreVal = document.getElementById('videoTitre').value;
  if (!file) return alert("Veuillez choisir une vidéo");
  
  openModal(async (pass) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch("/api/admin/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass, video: reader.result, titre: titreVal })
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else {
        alert("Vidéo ajoutée");
        chargerVideos();
      }
    };
    reader.readAsDataURL(file);
  });
}

async function supprimerVideo(id) {
  openModal(async (pass) => {
    const res = await fetch(`/api/admin/video/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass })
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else chargerVideos();
  });
}

// LANCEMENT ACCUEIL
chargerProduits();
chargerVideos();
