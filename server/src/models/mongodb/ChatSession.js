const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
  user_id:    { type: Number, required: true },
  user_name:  { type: String },
  title:      { type: String, default: 'New Chat' },
  messages:   [messageSchema],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ChatSession', chatSessionSchema);