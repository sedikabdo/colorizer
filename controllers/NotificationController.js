const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");

class NotificationController {
  static async showNotifications(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const notifications = await NotificationModel.getNotifications(userId);
      const currentUser = await NotificationModel.getUserById(userId);
      const currentUserAvatar = currentUser && currentUser.avatar 
        ? (currentUser.avatar.includes('/uploads/avatars/') ? currentUser.avatar : `/uploads/avatars/${currentUser.avatar}`) 
        : '/uploads/images/pngwing.com.png';

      const enrichedNotifications = notifications.map(notification => ({
        ...notification,
        sender_avatar: notification.sender_avatar 
          ? (notification.sender_avatar.includes('/uploads/avatars/') ? notification.sender_avatar : `/uploads/avatars/${notification.sender_avatar}`) 
          : '/uploads/images/pngwing.com.png'
      }));

      const unreadCount = await NotificationModel.getUnreadCount(userId);

      res.render("notifications", { 
        notifications: enrichedNotifications, 
        unreadCount, 
        userId, 
        currentUserAvatar,
        errorMessage: null,
        successMessage: null
      });
    } catch (error) {
      console.error("Error showing notifications:", error);
      res.status(500).render("notifications", {
        notifications: [],
        unreadCount: 0,
        userId: null,
        currentUserAvatar: '/uploads/images/pngwing.com.png',
        errorMessage: "حدث خطأ أثناء عرض الإشعارات",
        successMessage: null
      });
    }
  }

  static async markAsViewed(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const notificationId = req.params.id;

      const notification = await NotificationModel.getNotificationById(notificationId);
      if (!notification || notification.user_id !== userId) {
        throw new Error("الإشعار غير موجود أو ليس لك");
      }

      await NotificationModel.markAsViewed(notificationId);
      res.redirect("/notifications");
    } catch (error) {
      console.error("Error marking notification as viewed:", error);
      res.redirect("/notifications");
    }
  }

  static async deleteNotification(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;
      const notificationId = req.params.id;

      const notification = await NotificationModel.getNotificationById(notificationId);
      if (!notification || notification.user_id !== userId) {
        throw new Error("الإشعار غير موجود أو ليس لك");
      }

      await NotificationModel.deleteNotification(notificationId);
      res.redirect("/notifications");
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.redirect("/notifications");
    }
  }

  static async deleteAllNotifications(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      await NotificationModel.deleteAllNotifications(userId);
      res.redirect("/notifications");
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      res.redirect("/notifications");
    }
  }

  static async sendAdminNotification(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const senderId = decoded.id;
      const { message } = req.body;
      const imageUrl = req.file ? "/uploads/notifications/" + req.file.filename : null;

      if (!message || message.trim() === "") {
        throw new Error("يجب إدخال رسالة للإشعار");
      }

      await NotificationModel.createAdminNotificationForAllUsers(senderId, message, imageUrl);
      res.redirect("/admin/notify");
    } catch (error) {
      console.error("Error sending admin notification:", error);
      res.status(500).render("adminNotify", {
        errorMessage: error.message || "حدث خطأ أثناء إرسال الإشعار",
        successMessage: null
      });
    }
  }
}

module.exports = NotificationController;