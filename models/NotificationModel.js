const db = require("../config/db");

class NotificationModel {
  static createNotification(receiverId, senderId, type, message) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO notifications (user_id, sender_id, type, message, viewed, created_at)
        VALUES (?, ?, ?, ?, 0, NOW())
      `;
      db.query(query, [receiverId, senderId, type, message], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getNotifications(userId) {
    const query = `
      SELECT n.*, u.name AS sender_name, u.avatar AS sender_avatar
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async getUserById(userId) {
    const query = `
      SELECT id, name, avatar
      FROM users
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async getNotificationById(notificationId) {
    const query = `
      SELECT id, user_id, sender_id
      FROM notifications
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [notificationId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static async markAsViewed(notificationId) {
    const query = "UPDATE notifications SET viewed = 1 WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [notificationId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async deleteNotification(notificationId) {
    const query = "DELETE FROM notifications WHERE id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [notificationId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async deleteAllNotifications(userId) {
    const query = "DELETE FROM notifications WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async createAdminNotificationForAllUsers(senderId, message, imageUrl) {
    const query = `
      INSERT INTO notifications (user_id, sender_id, type, message, image_url, viewed, created_at)
      SELECT id, ?, 'admin', ?, ?, 0, NOW()
      FROM users
      WHERE id != ? AND is_active = 1
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [senderId, message, imageUrl, senderId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getUnreadCount(userId) {
    const query = "SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND viewed = 0";
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0].unread_count || 0);
      });
    });
  }
}

module.exports = NotificationModel;