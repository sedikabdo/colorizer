const express = require("express");
const multer = require("multer");
const ChatController = require("../controllers/chatController");

const router = express.Router();

// إعداد Multer لتخزين الصور في مجلد معين
const upload = multer({ dest: "uploads/chatimage/" }); // تغيير المسار هنا

// عرض صفحة الدردشة مع الصديق
router.get("/chat/:friendId", ChatController.getChatPage);

// إرسال رسالة جديدة
router.post(
  "/chat/sendMessage",
  upload.single("imagePath"), // استخدام upload لتخزين الصورة المرفقة
  ChatController.sendMessage
);
// حذف كل الرسائل
router.post("/messages/delete-all", ChatController.deleteAllMessages);

// حذف رسالة معينة
router.post("/messages/delete/:messageId", ChatController.deleteMessage);

// عرض صفحة الرسائل الواردة
router.get("/messages", ChatController.getMessagesPage);

module.exports = router;
