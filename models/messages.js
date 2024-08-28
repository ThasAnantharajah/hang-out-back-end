const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  //   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  sender: String,
  reciver: String,
  messageText: String,
  create: {type: Date, default: Date.now},

});

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;