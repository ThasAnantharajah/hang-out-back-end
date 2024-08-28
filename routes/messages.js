var express = require("express");
var router = express.Router();
const Message = require("../models/messages");

router.post("/message-send", async (req, res) => {
  const { sender, receiver, messageText } = req.body;
  const message = new Message({ sender, receiver, messageText });

  try {
    await message.save();
    res.status(200).json({ message: "Message envoyé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
});


router.get('/messages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});







module.exports = router;