var express = require("express");
var router = express.Router();
const Sports = require("../models/sports");



router.get('/sports', async (req, res) => {
  

  try {
    // Récupère toutes les sports de la collection avec la methode find
    const activities = await Activity.find(); 
    res.json(activities); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des activités' });
  }
  
});

module.exports = router;