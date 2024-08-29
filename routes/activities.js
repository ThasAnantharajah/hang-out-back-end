var express = require("express");
var router = express.Router();
const Activities = require("../models/activities");



router.get('/activities', async (req, res) => {
  const { userId } = req.params;

  try {
    // Récupère toutes les activités de la collection avec la methode find
    const activities = await Activity.find(); 
    res.json(activities); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des activités' });
  }
  
});







module.exports = router;