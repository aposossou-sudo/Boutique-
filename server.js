const express = require("express");
const app = express();
const PORT = 5000;
const HOST = "0.0.0.0";

app.use(express.json({ limit: "50mb" }));
app.use(express.static("."));

const ADMIN_PASSWORD = "kouame";

let produits = [];
let videos = [];

app.get("/api/produits", (req, res) => {
  res.json(produits);
});

app.post("/api/admin/produit", (req, res) => {
  const { password, nom, prix, image } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Mot de passe incorrect" });

  produits.push({ id: Date.now(), nom, prix: Number(prix), image });
  res.json({ success: true });
});

app.delete("/api/admin/produit/:id", (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Mot de passe incorrect" });

  produits = produits.filter(p => p.id != req.params.id);
  res.json({ success: true });
});

app.get("/api/videos", (req, res) => {
  res.json(videos);
});

app.post("/api/admin/video", (req, res) => {
  const { password, video, titre } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Mot de passe incorrect" });

  videos.push({ id: Date.now(), video, titre: titre || "Témoignage client" });
  res.json({ success: true });
});

app.delete("/api/admin/video/:id", (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Mot de passe incorrect" });

  videos = videos.filter(v => v.id != req.params.id);
  res.json({ success: true });
});

app.put("/api/admin/produit/:id", (req, res) => {
  const { password, nom, prix } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Mot de passe incorrect" });
  
  const index = produits.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    produits[index] = { ...produits[index], nom, prix: Number(prix) };
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Produit non trouvé" });
  }
});

app.listen(PORT, HOST, () => console.log("Serveur lancé sur " + HOST + ":" + PORT));
