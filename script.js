const phone = "2290167924076";
const loader = document.getElementById("loader");

function showLoader() {
  loader.style.display = "flex";
  setTimeout(()=>loader.style.display="none",1500);
}

document.addEventListener("click", showLoader);

function demanderMotDePasse(){
  const pass = prompt("Entrez le mot de passe admin");
  if(pass==="kouame") window.location="admin.html";
  else alert("Mot de passe incorrect");
}

function formatCFA(nombre){
  return new Intl.NumberFormat('fr-FR').format(nombre)+" FCFA";
}

function commander(nom, prix){
  const msg = `Bonjour, je veux commander ${nom} au prix de ${prix}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
}

async function chargerProduits(){
  const res = await fetch("/api/produits");
  const produits = await res.json();
  const container = document.getElementById("produits");
  if(!container) return;
  const badges = ["🔥 Best seller","⭐ Très demandé","💎 Offre limitée"];
  container.innerHTML="";
  produits.forEach((p,i)=>{
    const badge = badges[Math.floor(Math.random()*badges.length)];
    const div=document.createElement("div");
    div.className="card";
    div.style.animationDelay=`${i*0.1}s`;
    div.innerHTML=`
      <span class="badge">${badge}</span>
      <img src="${p.image}">
      <h3>${p.nom}</h3>
      <p>${formatCFA(p.prix)}</p>
      <button onclick="commander('${p.nom}','${formatCFA(p.prix)}')">Commander</button>
    `;
    container.appendChild(div);
  });
}

async function chargerVideo(){
  const res = await fetch("/api/video");
  const data = await res.json();
  const video = document.getElementById("video");
  if(video && data.video) video.src = data.video;
}

async function ajouterProduit(){
  const file = imageFile.files[0];
  if(!file) return alert("Veuillez choisir une image");
  const reader = new FileReader();
  reader.onload=async()=>{
    await fetch("/api/admin/produit",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        password:password.value,
        nom:nom.value,
        prix:Number(prix.value),
        image:reader.result
      })
    });
    alert("Produit ajouté avec succès");
  };
  reader.readAsDataURL(file);
}

async function ajouterVideo(){
  const file = videoFile.files[0];
  if(!file) return alert("Veuillez choisir une vidéo");
  if(file.size>10*1024*1024) return alert("La vidéo doit faire moins de 10 Mo");
  const reader = new FileReader();
  reader.onload=async()=>{
    await fetch("/api/admin/video",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({password:password.value,video:reader.result})
    });
    alert("Vidéo ajoutée avec succès");
  };
  reader.readAsDataURL(file);
}

// LANCEMENT ACCUEIL
chargerProduits();
chargerVideo();
