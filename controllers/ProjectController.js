const Project = require("../models/Project");
const MessagesProject = require("../models/MessagesProject");

class ProjectController {
  static getCreateProject(req, res) {
    res.render("create_project");
  }

  static async postCreateProject(req, res) {
    try {
      const { projectTitle, manualDescription, budget, duration } = req.body;

      if (!projectTitle || !manualDescription || !budget || !duration) {
        return res.status(400).send("يرجى ملء جميع الحقول المطلوبة");
      }

      const userId = req.user.id;

      const projectData = {
        title: projectTitle,
        description: manualDescription.trim(),
        budget: parseFloat(budget),
        duration: parseInt(duration, 10),
        user_id: userId,
      };

      await Project.create(projectData);
      res.redirect("/projects");
    } catch (error) {
      console.error("خطأ أثناء إضافة المشروع:", error);
      res.status(500).send("حدث خطأ في الخادم");
    }
  }

  static async getAllProjects(req, res) {
    try {
      const projects = await Project.findAll();
      res.render("projects", { projects });
    } catch (error) {
      console.error("خطأ أثناء جلب المشاريع:", error);
      res.status(500).send("حدث خطأ أثناء جلب المشاريع");
    }
  }

  static async getProjectDetails(req, res) {
    try {
      const projectId = req.params.id;
      const project = await Project.getProjectById(projectId);
      if (!project) {
        return res.status(404).send("المشروع غير موجود");
      }
      res.render("project-details", { project });
    } catch (error) {
      console.error("خطأ أثناء جلب تفاصيل المشروع:", error);
      res.status(500).send("حدث خطأ أثناء جلب تفاصيل المشروع");
    }
  }

  static async postApplyProject(req, res) {
    try {
      const { project_id, applicant_name, applicant_email, motivation } = req.body;
      const applicant_id = req.user.id;

      console.log("بيانات الطلب الواردة:", {
        project_id,
        applicant_name,
        applicant_email,
        motivation,
        applicant_id,
      });

      const project = await Project.findById(project_id);
      if (!project) {
        return res.status(404).json({ success: false, message: "المشروع غير موجود" });
      }

      const existingApplication = await Project.getApplicationByUserAndProject(applicant_id, project_id);
      if (existingApplication) {
        return res.status(400).json({ success: false, message: "لقد قمت بالفعل بإرسال طلب لهذا المشروع" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(applicant_email)) {
        return res.status(400).json({ success: false, message: "البريد الإلكتروني غير صالح" });
      }

      const applicationData = {
        project_id,
        applicant_name,
        applicant_email,
        motivation,
        applicant_id,
      };

      await Project.createApplication(applicationData);
      console.log("تم حفظ الطلب بنجاح في قاعدة البيانات");

      res.json({ success: true, message: "تم إرسال الطلب بنجاح!" });
    } catch (error) {
      console.error("تفاصيل الخطأ:", error);
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم", error: error.message });
    }
  }

  static async getProjectRequests(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).send("غير مصرح لك بالوصول إلى هذه الصفحة");
      }

      const userId = req.user.id;
      const requests = await Project.getProjectRequests(userId);
      res.render("project_requests", { requests });
    } catch (error) {
      console.error("خطأ أثناء جلب طلبات المشروع:", error);
      res.status(500).send("حدث خطأ أثناء جلب طلبات المشروع");
    }
  }

  static async acceptRequest(req, res) {
    try {
      const requestId = req.params.requestId;
      const ownerId = req.user.id;

      const request = await Project.getRequestById(requestId);
      if (!request) {
        return res.status(404).json({ success: false, message: "الطلب غير موجود" });
      }

      const project = await Project.findById(request.project_id);
      if (project.user_id !== ownerId) {
        return res.status(403).json({ success: false, message: "غير مصرح لك بقبول هذا الطلب" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({ success: false, message: "لا يمكن قبول طلب تمت معالجته مسبقًا" });
      }

      await Project.updateRequestStatus(requestId, "accepted");

      const conversationData = {
        project_id: request.project_id,
        sender_id: ownerId,
        receiver_id: request.applicant_id,
        message: "تم قبول طلبك للانضمام إلى المشروع. يمكنك البدء في المحادثة الآن.",
        status: "accepted",
        conversation_id: requestId,
      };

      console.log("بيانات المحادثة المرسلة:", conversationData);
      const conversation = await MessagesProject.create(conversationData);
      console.log("نتيجة إنشاء المحادثة:", conversation);

      res.json({
        success: true,
        message: "تم قبول الطلب وفتح محادثة بنجاح",
        conversationId: conversation.insertId || requestId,
      });
    } catch (error) {
      console.error("خطأ أثناء قبول الطلب:", error.message, error.stack);
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم", error: error.message });
    }
  }

  static async rejectRequest(req, res) {
    try {
      const requestId = req.params.requestId;
      const ownerId = req.user.id;

      const request = await Project.getRequestById(requestId);
      if (!request) {
        return res.status(404).json({ success: false, message: "الطلب غير موجود" });
      }

      const project = await Project.findById(request.project_id);
      if (project.user_id !== ownerId) {
        return res.status(403).json({ success: false, message: "غير مصرح لك برفض هذا الطلب" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({ success: false, message: "لا يمكن رفض طلب تمت معالجته مسبقًا" });
      }

      await Project.updateRequestStatus(requestId, "rejected");

      res.json({
        success: true,
        message: "تم رفض الطلب بنجاح",
      });
    } catch (error) {
      console.error("خطأ أثناء رفض الطلب:", error.message, error.stack);
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم", error: error.message });
    }
  }

  static async updateRequestStatus(req, res) {
    try {
      const requestId = req.params.requestId;
      const { status } = req.body;

      await Project.updateRequestStatus(requestId, status);

      res.json({ success: true, message: "تم تحديث حالة الطلب بنجاح" });
    } catch (error) {
      console.error("خطأ أثناء تحديث حالة الطلب:", error);
      res.status(500).json({ success: false, message: "حدث خطأ في الخادم" });
    }
  }
}

module.exports = ProjectController;