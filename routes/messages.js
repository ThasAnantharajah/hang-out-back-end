var express = require("express");
var router = express.Router();
const Message = require("../models/messages");

// router.post("/send", async (req, res) => {
//   const { sender, receiver, content } = req.body;
//   console.log("req.body", req.body);
//   try {
//     const newMessage = new Message({ sender, receiver, content });
//     await newMessage.save();
//     res
//       .status(201)
//       .json({ message: "Message envoyé avec succès", data: newMessage });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Erreur lors de l'envoi du message", error });
//   }
// });


router.get("/discution/:userId1/:userId2", async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 }); // Trie les messages par ordre chronologique
    res.status(200).json({ messages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des messages", error });
  }
});


router.get("/readMessages/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const { userId } = req.params;
    const reciveMessages = await Message.find({
      receiver: userId,
      read: false,
    });
    res.status(200).json({ reciveMessages });
  } catch (error) {
    console.error("Erreur messages non lus:", error);
    res.status(500).json({ error: "Erreur config serveur" });
  }
});


// router.put("/markMessages/:messageId", async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     await Message.findByIdAndUpdate(messageId, { read: true });
//     res.status(200).json({ message: "Message marqué comme lu" });
//   } catch (error) {
//     console.error("Erreur lors du mise à jour du message:", error);
//     res.status(500).json({ error: "Erreur config serveur" });
//   }
// });


router.put('/messages/markMessages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking message as read', error });
  }
});

router.patch('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { read } = req.body;

    // Trouver le message et mettre à jour l'état de lecture
    const message = await Message.findByIdAndUpdate(messageId, { read }, { new: true });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({   
 error: 'Internal server error' });
  }
});

module.exports = router;




















// var express = require("express");
// var router = express.Router();
// const Message = require("../models/messages");

// router.post("/send", async (req, res) => {
//   const { sender, receiver, content } = req.body;
//   console.log("req.body", req.body);
//   try {
//     const newMessage = new Message({ sender, receiver, content });
//     await newMessage.save();
//     res
//       .status(201)
//       .json({ message: "Message envoyé avec succès", data: newMessage });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Erreur lors de l'envoi du message", error });
//   }
// });


// router.get("/discution/:userId1/:userId2", async (req, res) => {
//   const { userId1, userId2 } = req.params;
//   try {
//     const messages = await Message.find({
//       $or: [
//         { sender: userId1, receiver: userId2 },
//         { sender: userId2, receiver: userId1 },
//       ],
//     }).sort({ timestamp: 1 }); // Trie les messages par ordre chronologique
//     res.status(200).json({ messages });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Erreur lors de la récupération des messages", error });
//   }
// });


// router.get("/readMessages/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const { userId } = req.params;
//     const reciveMessages = await Message.find({
//       receiver: userId,
//       read: false,
//     });
//     res.status(200).json({ reciveMessages });
//   } catch (error) {
//     console.error("Erreur messages non lus:", error);
//     res.status(500).json({ error: "Erreur config serveur" });
//   }
// });


// router.put("/markMessages/:messageId", async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     await Message.findByIdAndUpdate(messageId, { read: true });
//     res.status(200).json({ message: "Message marqué comme lu" });
//   } catch (error) {
//     console.error("Erreur lors du mise à jour du message:", error);
//     res.status(500).json({ error: "Erreur config serveur" });
//   }
// });

// module.exports = router;