const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: String, // 'success', 'warning', 'info', 'danger'
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  actionUrl: String // opcional, para acciones rápidas
});

module.exports = mongoose.model('Notification', notificationSchema);
