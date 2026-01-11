const express = require("express");
const app = express();
const PORT = 10000;

app.use(express.json({ limit: "15mb" }));
app.use(express.static("."));

const ADMIN_PASSWORD = "kouame";

let produits = [];
let videoTemoignage = "";

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

app.post("/api/admin/video", (req, res) => {
  const { password, video } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Mot de passe incorrect" });

  videoTemoignage = video;
  res.json({ success: true });
});

app.get("/api/video", (req, res) => {
  res.json({ video: videoTemoignage });
});

app.listen(PORT, () => console.log("Serveur lancé sur le port " + PORT));
