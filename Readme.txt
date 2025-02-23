نجحت العملية الان سوف نعمل علي جزء الوظائف بنفس طريقة المشاريع لكن ابسط عند تقديم للوظيفة من خلال الفورم المخفي في listing-job  يتم ارسال رسالة الطلب فقط للمستخدم صاحب اعلان الوظيفة فقط في صفحة طلبات التوظيف مع صورة افتار المستخدم الذي ارسل الطلب مع امكانية عرض صفحة البروفايل الخاصة به عند الضغط علي اسمه او صورة بروفايله مع معلومات التي تم ارسالها في الفورم ليس لدي صفحة طلبات الاكواد <!DOCTYPE html>
<html lang="ar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>وظائف العمل عن بعد</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <style>
      /* تعريف المتغيرات الأساسية لنظام الألوان */
      :root {
        --primary: #1e3a8a; /* أزرق داكن */
        --secondary: #10b981; /* أخضر عصري */
        --accent: #f59e0b; /* لمسة برتقالية/صفراء */
        --background-color: #f4f7fa; /* خلفية فاتحة */
        --card-bg: #ffffff; /* خلفية البطاقات */
        --text-color: #333333; /* لون نص داكن */
        --border-radius: 8px;
        --transition: 0.3s ease;
      }

      /* إعادة تعيين الأساسيات */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Tajawal", sans-serif;
      }

      body {
        background-color: var(--background-color);
        color: var(--text-color);
      }

      a {
        text-decoration: none;
        color: inherit;
      }

      /* الهيدر */
      header {
        background: linear-gradient(135deg, var(--primary), #3158b0);
        color: #fff;
        padding: 20px;
        text-align: center;
        position: sticky;
        top: 0;
        z-index: 100;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      header h1 {
        font-size: 2.2em;
        font-weight: 700;
      }

      /* الحاوية الرئيسية */
      .container {
        max-width: 1200px;
        margin: 40px auto;
        padding: 0 20px;
      }

      /* قائمة عرض الوظائف */
      .job-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      /* بطاقة الوظيفة (تصميم عرضي) */
      .job-card {
        background: var(--card-bg);
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 15px 20px;
        transition: transform var(--transition), box-shadow var(--transition);
        display: flex;
        align-items: center;
        justify-content: space-between; /* الأيقونة أقصى اليسار والتفاصيل أقصى اليمين */
        max-width: 100%;
      }
      .job-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }

      /* أيقونة الوظيفة */
      .job-icon-container {
        flex-shrink: 0;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--secondary);
        border-radius: 50%;
        color: #fff;
        font-size: 1.8em;
      }

      /* تفاصيل الوظيفة */
      .job-details {
        flex: 1;
        text-align: right;
      }
      .job-details h3 {
        font-size: 1.5em;
        color: var(--primary);
        margin-bottom: 5px;
      }
      .job-meta {
        font-size: 0.9em;
        color: #777;
        margin-bottom: 10px;
      }
      .job-meta span {
        margin-right: 10px;
      }
      .job-details p {
        font-size: 1em;
        margin-bottom: 10px;
      }
      .apply-btn {
        display: inline-block;
        padding: 10px 15px;
        background: var(--secondary);
        color: #fff;
        border-radius: var(--border-radius);
        font-size: 1em;
        transition: background var(--transition), transform var(--transition);
        border: none;
        cursor: pointer;
      }
      .apply-btn i {
        margin-left: 5px;
      }
      .apply-btn:hover {
        background: #0e9d75;
        transform: scale(1.03);
      }

      /* تصميم نموذج التقديم (مودال) */
      .hidden-form {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--card-bg);
        border-radius: var(--border-radius);
        padding: 30px;
        width: 90%;
        max-width: 500px;
        z-index: 150;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        animation: fadeIn 0.3s ease-out;
      }
      .hidden-form.active {
        display: block;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translate(-50%, -45%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
      .hidden-form input,
      .hidden-form textarea {
        width: 100%;
        padding: 12px 15px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        font-size: 1em;
        transition: border-color var(--transition);
      }
      .hidden-form input:focus,
      .hidden-form textarea:focus {
        border-color: var(--primary);
        outline: none;
      }
      .hidden-form button[type="submit"] {
        width: 100%;
        padding: 12px;
        background: var(--accent);
        border: none;
        border-radius: var(--border-radius);
        font-size: 1em;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
        transition: background var(--transition);
      }
      .hidden-form button[type="submit"]:hover {
        background: #d98806;
      }

      /* خلفية التعتيم للمودال */
      .modal-backdrop {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
        animation: fadeInBackdrop 0.3s ease-out;
      }
      .modal-backdrop.active {
        display: block;
      }
      @keyframes fadeInBackdrop {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      /* زر إغلاق المودال */
      .close-modal {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 1.5em;
        color: var(--primary);
        cursor: pointer;
      }

      /* تعديلات الاستجابة */
      @media (max-width: 768px) {
        header h1 {
          font-size: 1.8em;
        }
        .job-card {
          flex-direction: column;
          align-items: flex-start;
        }
        .job-icon-container {
          width: 50px;
          height: 50px;
          font-size: 1.2em;
        }
        .job-details {
          text-align: left;
          width: 100%;
        }
        .apply-btn {
          align-self: stretch;
        }
      }
    </style>
  </head>
  <%- include('partials/headerhome') %> <%- include('partials/headeraction') %>
  <body>
    <!-- قائمة الوظائف -->
    <div class="container">
      <div class="job-grid">
        <% jobs.forEach(function(job) { %>
        <div class="job-card">
          <!-- الأيقونة أقصى اليسار -->
          <div class="job-icon-container">
            <i class="fas fa-briefcase"></i>
          </div>
          <!-- تفاصيل الوظيفة أقصى اليمين -->
          <div class="job-details">
            <h3><%= job.title %></h3>
            <div class="job-meta">
              <span><i class="fas fa-clock"></i> <%= job.job_type %></span>
              <span
                ><i class="fas fa-map-marker-alt"></i> <%= job.location %></span
              >
            </div>
            <p><strong>الوصف:</strong> <%= job.description %></p>
            <p>
              <strong>الراتب:</strong>
              <%= job.salary_min ? job.salary_min + " - " + job.salary_max + " "
              + job.currency : "غير محدد" %>
            </p>
            <button class="apply-btn" onclick="openModal('<%= job.job_id %>')">
              التقديم للوظيفة <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        <% }); %>
      </div>
    </div>

    <!-- خلفية التعتيم للمودال -->
    <div id="modal-backdrop" class="modal-backdrop"></div>

    <!-- نماذج التقديم لكل وظيفة -->
    <% jobs.forEach(function(job) { %>
    <div id="modal-<%= job.job_id %>" class="hidden-form">
      <button class="close-modal" onclick="closeModal('<%= job.job_id %>')">
        &times;
      </button>
      <form onsubmit="submitApplication(event, '<%= job.job_id %>')">
        <input type="hidden" name="job_id" value="<%= job.job_id %>" />
        <input type="text" name="applicant_name" placeholder="اسمك" required />
        <input
          type="email"
          name="applicant_email"
          placeholder="بريدك الإلكتروني"
          required
        />
        <textarea
          name="cover_letter"
          placeholder="رسالة التقديم"
          required
        ></textarea>
        <button type="submit">إرسال الطلب</button>
      </form>
    </div>
    <% }); %>

    <script>
      function openModal(jobId) {
        document.getElementById("modal-" + jobId).classList.add("active");
        document.getElementById("modal-backdrop").classList.add("active");
      }
      function closeModal(jobId) {
        document.getElementById("modal-" + jobId).classList.remove("active");
        document.getElementById("modal-backdrop").classList.remove("active");
      }
      async function submitApplication(event, jobId) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        try {
          const response = await fetch("/apply/" + jobId, {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          if (response.ok) {
            alert("✅ تم إرسال الطلب بنجاح!");
            form.reset();
            closeModal(jobId);
          } else {
            alert("❌ فشل في إرسال الطلب: " + result.message);
          }
        } catch (error) {
          console.error("Error during submission:", error);
          alert("❌ حدث خطأ أثناء الإرسال");
        }
      }
    </script>
    <footer style="margin-top: 24vh"><%- include('partials/footer') %></footer>
  </body>
</html>
 و const express = require("express");
const router = express.Router();
const JobController = require("../controllers/jobControllers");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// 📌 إعداد مسارات تحميل الملفات
const uploadDir = path.resolve(__dirname, "../uploads/picjobs");
const cvDir = path.resolve(__dirname, "../uploads/cvs");

// ✅ إنشاء المجلدات إن لم تكن موجودة
[uploadDir, cvDir].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 تم إنشاء المجلد: ${dir}`);
    }
  } catch (error) {
    console.error(`❌ خطأ في إنشاء المجلد ${dir}:`, error);
  }
});

// 📌 إعداد multer لتحميل صور الوظائف
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    console.log(`📷 رفع صورة الوظيفة: ${filename}`);
    cb(null, filename);
  },
});
const upload = multer({ storage });

// 🌟 مسارات الوظائف

// إضافة وظيفة جديدة مع رفع شعار الوظيفة
router.post(
  "/jobs/add",
  upload.single("logo"),
  (req, res, next) => {
    console.log("📌 بيانات الطلب المستلمة:", req.body);
    console.log("📷 ملف الصورة المستلم:", req.file);

    // إذا كان userId غير موجود في req.user، يمكنك تمريره يدويًا عبر req.body
    if (!req.user) {
      req.user = { id: req.body.userId }; // تعيين req.user يدويًا
    }

    next();
  },
  JobController.addJob
);

// تقديم طلب وظيفة (يُخزن فقط الاسم، البريد الإلكتروني، والتعليق)
// نستخدم multer().none() لتحليل بيانات الـ FormData دون ملفات
router.post("/apply/:jobId", multer().none(), JobController.applyJob);

// جلب جميع الوظائف (API)
router.get("/jobPage/all", JobController.getAllJobs);

// جلب طلبات التوظيف لوظيفة معينة (API)
router.get("/applications/:jobId", JobController.getApplications);

// عرض صفحات الوظائف (Rendering)
router.get("/jobs", (req, res) => res.render("jobs"));
router.get("/add-job", (req, res) => res.render("add-job"));

// عرض صفحة قائمة الوظائف بتفاصيلها
router.get("/listing-job", JobController.renderAllJobs);

// عرض صفحة طلبات التوظيف:
// إذا كان معرف الوظيفة موجودًا في الرابط، تعرض طلبات تلك الوظيفة فقط
// إذا لم يكن موجودًا، تعرض جميع الطلبات (يمكنك تخصيص هذا السلوك حسب الحاجة)
router.get("/jobapplications/:jobId?", JobController.renderAllApplications);

// عرض تفاصيل الوظيفة عند الضغط عليها
router.get("/job/:jobId", JobController.renderJobDetail);

module.exports = router; و const db = require("../config/db");

class JobModel {
  // إضافة وظيفة جديدة
  static async addJob(jobData) {
    const sql = `
      INSERT INTO jobs 
      (title, description, job_type, education, currency, salary_min, salary_max, salary_after_interview, location, experience, duration, logo, expires_at, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      jobData.title,
      jobData.description,
      jobData.jobType,
      jobData.education,
      jobData.currency,
      jobData.salaryMin,
      jobData.salaryMax,
      jobData.salaryAfterInterview || 0,
      jobData.location,
      jobData.experience,
      jobData.duration,
      jobData.logo,
      jobData.expiresAt,
      jobData.userId,
    ];
  
    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, results) => {
        if (err) {
          console.error("❌ Database Error:", err);
          reject(err);
        } else {
          console.log("✅ Job added with ID:", results.insertId);
          resolve(results.insertId);
        }
      });
    });
  }
  

  // جلب جميع الوظائف مع معلومات المستخدم
  static async getAllJobs() {
    const sql = `
      SELECT 
        j.job_id, j.title, j.description, j.job_type, j.education, j.currency, 
        j.salary_min, j.salary_max, j.salary_after_interview, 
        j.location, j.experience, j.duration, j.created_at, j.expires_at,
        u.name AS user_name, u.avatar AS user_avatar
      FROM jobs j
      LEFT JOIN users u ON j.owner_id = u.id
      ORDER BY j.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // إضافة طلب توظيف جديد
  static async addApplication(jobId, applicantName, applicantEmail, coverLetter) {
    const sql = `
      INSERT INTO job_applications 
      (job_id, applicant_name, applicant_email, cover_letter) 
      VALUES (?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [jobId, applicantName, applicantEmail, coverLetter], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // جلب جميع طلبات التوظيف لوظيفة معينة
  static async getApplicationsByJob(jobId) {
    const sql = `
      SELECT * FROM job_applications 
      WHERE job_id = ? 
      ORDER BY created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [jobId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // جلب جميع طلبات التوظيف مع تفاصيل الوظيفة
  static async getAllApplications() {
    const sql = `
      SELECT 
        ja.application_id, ja.job_id, ja.applicant_name, ja.applicant_email, ja.cover_letter, ja.created_at,
        j.title AS job_title, j.location AS job_location
      FROM job_applications ja
      LEFT JOIN jobs j ON ja.job_id = j.job_id
      ORDER BY ja.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // حذف طلب توظيف معين
  static async deleteApplication(applicationId) {
    const sql = `DELETE FROM job_applications WHERE application_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [applicationId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // جلب تفاصيل وظيفة معينة
  static async getJobDetail(jobId) {
    const sql = `
      SELECT 
        j.*, 
        u.name AS user_name, u.avatar AS user_avatar
      FROM jobs j
      LEFT JOIN users u ON j.user_id = u.id
      WHERE j.job_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [jobId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }
}

module.exports = JobModel; و const JobModel = require("../models/jobModel");


class JobController {
  // إضافة وظيفة جديدة
  static async addJob(req, res) {
    try {
      const jobData = {
        ...req.body,
        salaryMin: parseFloat(req.body.salaryMin),
        salaryMax: parseFloat(req.body.salaryMax),
        duration: parseInt(req.body.duration, 10) || 0,
        logo: req.file?.filename ?? null,
        expiresAt: req.body.duration
          ? new Date(Date.now() + req.body.duration * 86400000).toISOString()
          : null,
      };

      const jobId = await JobModel.addJob(jobData);
      console.log("🚀 Job added with ID:", jobId);

     
      res.status(201).json({
        success: true,
        message: "تم إضافة الوظيفة بنجاح!",
        redirectUrl: "listing-job"
      });
    } catch (err) {
      console.error("❌ Error adding job:", err);
      res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء إضافة الوظيفة.",
      });
    }
  }


  // API: جلب جميع الوظائف وإرجاعها كـ JSON
  static async getAllJobs(req, res) {
    try {
      const jobs = await JobModel.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
      res.status(500).json({ error: "حدث خطأ أثناء جلب الوظائف." });
    }
  }

  // Render: عرض صفحة قائمة الوظائف مع البيانات
  static async renderAllJobs(req, res) {
    try {
      const jobs = await JobModel.getAllJobs();
      res.render("listing-job", { jobs });
    } catch (error) {
      console.error("❌ Error rendering jobs:", error);
      res.status(500).send("حدث خطأ أثناء عرض الوظائف.");
    }
  }

  // تقديم طلب وظيفة (تخزين الاسم، البريد الإلكتروني، والتعليق فقط)
  static async applyJob(req, res) {
    try {
      const { jobId } = req.params;
      const { applicant_name, applicant_email, cover_letter } = req.body;

      console.log("Received application:", {
        jobId,
        applicant_name,
        applicant_email,
        cover_letter,
      });

      if (!jobId || !applicant_name || !applicant_email || !cover_letter) {
        console.error("Missing required fields in application:", {
          jobId,
          applicant_name,
          applicant_email,
          cover_letter,
        });
        return res.status(400).json({ message: "جميع الحقول مطلوبة!" });
      }

      await new Promise((resolve, reject) => {
        JobModel.addApplication(
          jobId,
          applicant_name,
          applicant_email,
          cover_letter,
          (err, result) => {
            if (err) {
              console.error("Database error in addApplication:", err);
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });

      console.log("Application submitted successfully.");
      res.json({ success: true, message: "تم إرسال الطلب بنجاح!" });
    } catch (err) {
      console.error("❌ Error submitting application:", err);
      res.status(500).json({ error: "حدث خطأ أثناء تقديم الطلب." });
    }
  }

  // API: جلب جميع الطلبات لوظيفة معينة وإرجاعها كـ JSON
  static async getApplications(req, res) {
    try {
      const { jobId } = req.params;
      await new Promise((resolve, reject) => {
        JobModel.getApplicationsByJob(jobId, (err, applications) => {
          if (err) {
            reject(err);
          } else {
            resolve(applications);
          }
        });
      }).then((applications) => {
        res.json(applications);
      });
    } catch (err) {
      console.error("❌ Error fetching applications:", err);
      res.status(500).json({ error: "حدث خطأ أثناء جلب الطلبات." });
    }
  }

  // Render: عرض صفحة طلبات التوظيف مع البيانات (لعرضها لصاحب الإعلان)
  static async renderAllApplications(req, res) {
    try {
      const { jobId } = req.params;
      await new Promise((resolve, reject) => {
        // إذا كان معرف الوظيفة موجودًا، نعرض الطلبات الخاصة بها، وإلا نستعرض جميع الطلبات
        if (jobId) {
          JobModel.getApplicationsByJob(jobId, (err, applications) => {
            if (err) {
              reject(err);
            } else {
              resolve(applications);
            }
          });
        } else {
          JobModel.getAllApplications((err, applications) => {
            if (err) {
              reject(err);
            } else {
              resolve(applications);
            }
          });
        }
      }).then((applications) => {
        res.render("jobapplications", { applications });
      });
    } catch (err) {
      console.error("❌ Error rendering applications:", err);
      res.status(500).send("حدث خطأ أثناء عرض طلبات التوظيف.");
    }
  }

  // عرض تفاصيل الوظيفة
  static async renderJobDetail(req, res) {
    try {
      const { jobId } = req.params;
      const job = await JobModel.getJobDetail(jobId);
      if (!job) {
        return res.status(404).send("Job not found");
      }
      res.render("jobDetail", { job });
    } catch (error) {
      console.error("Error rendering job detail:", error);
      res.status(500).send("An error occurred while fetching job details.");
    }
  }
}

module.exports = JobController;