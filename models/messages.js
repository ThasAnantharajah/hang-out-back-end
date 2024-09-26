const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  content: { type: String },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }

});

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;