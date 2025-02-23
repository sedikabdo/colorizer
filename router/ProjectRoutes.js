const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");
const MessagesProjectController = require("../controllers/MessagesProjectController");
const verifyToken = require("../middleware/verifyToken");

// مسار إنشاء المشروع
router.post("/create", verifyToken, ProjectController.postCreateProject);

// مسار عرض قائمة المشاريع
router.get("/projects", ProjectController.getAllProjects);

// مسار تفاصيل المشروع
router.get('/project/:id', ProjectController.getProjectDetails);

// مسار إرسال طلب الانضمام
router.post("/apply-project", verifyToken, ProjectController.postApplyProject);

// مسار عرض طلبات المشروع
router.get("/project_requests", verifyToken, ProjectController.getProjectRequests);

// مسار قبول الطلب
router.post("/accept-request/:requestId", verifyToken, ProjectController.acceptRequest);

// مسار تحديث حالة الطلب
router.post("/update-request/:requestId", verifyToken, ProjectController.updateRequestStatus);
router.get("/ProjectSpace", (req, res) => res.render("ProjectSpace"));
router.get("/create_project", (req, res) => res.render("create_project"));
// مسار المحادثات الجارية
router.get("/ongoing_chats", verifyToken, MessagesProjectController.getOngoingChats);
module.exports = router;