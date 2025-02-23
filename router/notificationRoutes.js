const express = require("express");
const multer = require("multer");
const NotificationController = require("../controllers/NotificationController");
const router = express.Router();

// إعداد multer لتحميل الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notifications");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// عرض صفحة الإشعارات
router.get("/notifications", NotificationController.showNotifications);

// تحديث حالة الإشعار إلى "تم العرض"
router.post("/notifications/:id/markAsViewed", NotificationController.markAsViewed);

// حذف إشعار معين
router.post("/notifications/:id/delete", NotificationController.deleteNotification);

// حذف جميع الإشعارات
router.post("/notifications/delete-all", NotificationController.deleteAllNotifications);

// عرض صفحة إرسال إشعار من المسؤول
router.get("/admin/notify", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  const decoded = jwt.verify(token, "your_jwt_secret");
  if (decoded.role !== "admin") return res.status(403).send("غير مصرح لك");

  res.render("adminNotify", { errorMessage: null, successMessage: null });
});

// إرسال إشعار من المسؤول
router.post("/admin/notifications", upload.single("image"), NotificationController.sendAdminNotification);

module.exports = router;