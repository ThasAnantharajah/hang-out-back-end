const app = require('./app');  // Importe l'application Express
const http = require('http');  // Créer un serveur HTTP
const server = http.createServer(app);  // Lie l'application Express au serveur
const io = require('socket.io')(server);  // Initialise Socket.IO sur le serveur HTTP
const Message = require("./models/messages");  // Modèle de messages

const users = {};  // Objet pour stocker les utilisateurs connectés
// Track users viewing specific conversations
const viewingMessages = {};

// Événement de connexion socket.io
// Lorsque l'utilisateur se connecte, on stocke son socket avec son ID
io.on('connection', (socket) => {
  console.log('A user connected!');

  // Lorsque l'utilisateur se connecte, on stocke son socket avec son ID
  socket.on('userConnected', (userId) => {
    users[userId] = socket.id;  // Associer l'userId à son socket
    console.log(`${userId} is connected`);
  });

  socket.on('viewingMessages', ({ userId, receiverId }) => {
    viewingMessages[userId] = receiverId;  // Store the receiverId the user is chatting with
    console.log(`${userId} is viewing messages with ${receiverId}`);
  });

    // Track when a user stops viewing the conversation
  socket.on('stoppedViewingMessages', ({ userId }) => {
    delete viewingMessages[userId];  // Remove the user from the viewing list
    console.log(`${userId} stopped viewing messages`);
  });




  // socket.on('sendMessage', async (data) => {
  //   const { senderId, receiverId, content } = data;
  //   const newMessage = new Message({ sender: senderId, receiver: receiverId, content });

  //   await newMessage.save();

  //   try {
  //     // Vérifier si le destinataire est connecté
  //     if (users[receiverId]) {
  //       // Marquer le message comme lu
  //       await Message.findByIdAndUpdate(newMessage._id, { read: true });

  //       // Émettre le message comme "lu"
  //       io.to(users[receiverId]).emit('messageReceived', { 
  //         senderId, receiverId, content, read: true 
  //       });
  //     } else {
  //       // Si le destinataire n'est pas connecté, émettre le message normalement
  //       io.emit('messageReceived', { senderId, receiverId, content });
  //     }
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // });


   socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, content } = data;
    const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
    await newMessage.save();

    try {
      // Check if the recipient is viewing the conversation
      if (users[receiverId]) {
        // Check if the recipient is currently viewing this conversation
        if (viewingMessages[receiverId] === senderId) {
          // Mark the message as read
          await Message.findByIdAndUpdate(newMessage._id, { read: true });
          
          // Emit the message as read
          io.to(users[receiverId]).emit('messageReceived', { 
            senderId, receiverId, content, read: true 
          });
        } else {
          // Emit the message without marking as read
          io.to(users[receiverId]).emit('messageReceived', { senderId, receiverId, content });
        }
      } else {
        // If the recipient is not connected, emit the message normally
        io.emit('messageReceived', { senderId, receiverId, content });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Lorsque l'utilisateur se déconnecte
  // socket.on('disconnect', () => {
  //   for (let userId in users) {
  //     if (users[userId] === socket.id) {
  //       delete users[userId];  // Supprimer l'utilisateur des connectés
  //       console.log(`${userId} is disconnected`);
  //     }
  //   }
  // });

  socket.on('disconnect', () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];  // Remove user from connected list
        delete viewingMessages[userId];  // Remove user from viewing list
        console.log(`${userId} is disconnected`);
      }
    }
  });
});

// Démarrer le serveur sur le port 3000
try {
  server.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
} catch (error) {
  console.error('Error starting the server:', error);
}





