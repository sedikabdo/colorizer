const forumModel = require("../models/forumModel");
const JobModel = require("../models/jobModel");
const ProjectModel = require("../models/Project");
const jwt = require("jsonwebtoken");

class ForumController {
  static async addPost(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;

      const content = req.body.content;
      const images = req.files ? req.files.map((file) => file.filename) : [];

      console.log("بيانات النشر:", { userId, content, images });

      await forumModel.addPost(userId, content, images);
      res.redirect("/forum");
    } catch (err) {
      console.error("Error in addPost:", err);
      res.status(500).send("An error occurred while adding the post.");
    }
  }

  static async editPostForm(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;

      const postId = req.params.postId;
      const post = await forumModel.getPostDetails(postId);

      if (!post) {
        return res.status(404).send("المنشور غير موجود.");
      }

      const isOwner = await forumModel.isPostOwner(postId, userId);
      if (!isOwner) {
        return res.status(403).send("أنت لست صاحب هذا المنشور.");
      }

      post.user_avatar = post.user_avatar 
        ? (post.user_avatar.includes('/uploads/avatars/') ? post.user_avatar : `/uploads/avatars/${post.user_avatar}`) 
        : '/uploads/images/pngwing.com.png';

      res.render("editPost", { post });
    } catch (err) {
      console.error("Error fetching post details for editing:", err);
      res.status(500).send("An error occurred while fetching post details.");
    }
  }

  static async updatePost(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;

      const postId = req.params.postId;
      const { content } = req.body;
      const images = req.files ? req.files.map((file) => file.filename) : [];

      const isOwner = await forumModel.isPostOwner(postId, userId);
      if (!isOwner) {
        return res.status(403).send("أنت لست صاحب هذا المنشور.");
      }

      await forumModel.editPost(postId, content, images);
      res.redirect(`/forum`);
    } catch (err) {
      console.error("Error updating post:", err);
      res.status(500).send("An error occurred while updating the post.");
    }
  }

  static async deletePost(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;

      const postId = req.params.id;

      const isOwner = await forumModel.isPostOwner(postId, userId);
      if (!isOwner) {
        return res.status(403).send("أنت لست صاحب هذا المنشور.");
      }

      await forumModel.deletePost(postId);
      res.redirect("/forum");
    } catch (err) {
      console.error("Error in deletePost:", err);
      res.status(500).send("An error occurred while deleting the post.");
    }
  }

  static async toggleLike(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).json({ success: false, message: "User ID is required. Please log in." });
      }
      const userId = req.user.id;
      const postId = req.params.id;

      const liked = await forumModel.toggleLike(postId, userId);
      const likeCount = await forumModel.getLikeCount(postId);

      res.json({
        success: true,
        liked,
        likeCount,
      });
    } catch (err) {
      console.error("Error in toggleLike:", err);
      res.status(500).json({
        success: false,
        message: "حدث خطأ أثناء تبديل الإعجاب.",
      });
    }
  }

  static async addComment(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).json({ success: false, message: "User ID is required. Please log in." });
      }
      const userId = req.user.id;
      const { postId } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ success: false, message: "محتوى التعليق مطلوب." });
      }

      const comment = await forumModel.addComment(postId, userId, content);
      const userInfo = await forumModel.getUserById(userId);

      res.json({
        success: true,
        comment: {
          id: comment.insertId,
          content,
          user_name: userInfo.name,
          user_avatar: userInfo.avatar 
            ? (userInfo.avatar.includes('/uploads/avatars/') ? userInfo.avatar : `/uploads/avatars/${userInfo.avatar}`) 
            : '/uploads/images/pngwing.com.png',
          user_id: userId,
        },
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ success: false, message: "خطأ في إضافة التعليق." });
    }
  }

  static async getComments(req, res) {
    try {
      const { postId } = req.params;
      const comments = await forumModel.getComments(postId);

      const enrichedComments = comments.map(comment => ({
        ...comment,
        user_avatar: comment.user_avatar 
          ? (comment.user_avatar.includes('/uploads/avatars/') ? comment.user_avatar : `/uploads/avatars/${comment.user_avatar}`) 
          : '/uploads/images/pngwing.com.png'
      }));

      res.json({ success: true, comments: enrichedComments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ success: false, message: "خطأ في جلب التعليقات." });
    }
  }

  static async toggleLikeComment(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;
      const { commentId } = req.params;

      const liked = await forumModel.toggleLikeComment(commentId, userId);
      res.json({ liked });
    } catch (err) {
      console.error("Error toggling like on comment:", err);
      res.status(500).send("Error toggling like on comment.");
    }
  }

  static async sharePost(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;
      const postId = req.params.id;

      await forumModel.sharePost(userId, postId);
      res.redirect("/forum");
    } catch (err) {
      console.error("Error in sharePost:", err);
      res.status(500).send("An error occurred while sharing the post.");
    }
  }

  static async hidePost(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;
      const postId = req.params.id;

      const isHidden = await forumModel.checkHiddenPost(userId, postId);
      if (!isHidden) {
        await forumModel.hidePost(userId, postId);
      }
      res.redirect("/forum");
    } catch (err) {
      console.error("Error in hidePost:", err);
      res.status(500).send("An error occurred while hiding the post.");
    }
  }

  static async addAd(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).json({ success: false, message: "User ID is required. Please log in." });
      }
      const userId = req.user.id;
      const { title, description } = req.body;
      const image = req.file ? req.file.filename : null;

      if (!title) {
        return res.status(400).json({ success: false, message: "العنوان مطلوب." });
      }

      const dailyAdCount = await forumModel.getDailyAdCount(userId);
      if (dailyAdCount >= 3) {
        return res.status(403).json({ success: false, message: "لقد وصلت إلى الحد الأقصى للإعلانات اليومية (3 إعلانات)." });
      }

      console.log("بيانات الإعلان:", { userId, title, description, image });

      const adId = await forumModel.addAd(userId, title, description, image);
      res.json({ 
        success: true, 
        message: "تم إضافة الإعلان بنجاح!", 
        adId,
        filename: image
      });
    } catch (err) {
      console.error("Error in addAd:", err);
      res.status(500).json({ success: false, message: "حدث خطأ أثناء إضافة الإعلان." });
    }
  }

  static async getAllPosts(req, res) {
    try {
      const token = req.cookies.token;
      let userId = null;
      let currentUserAvatar = null;
      let currentUserName = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, "your_jwt_secret");
          userId = decoded.id;
          const userInfo = await forumModel.getUserAvatar(userId);
          currentUserAvatar = userInfo.avatar 
            ? (userInfo.avatar.includes('/uploads/avatars/') ? userInfo.avatar : `/uploads/avatars/${userInfo.avatar}`) 
            : '/uploads/images/pngwing.com.png';
          currentUserName = userInfo.name;
        } catch (err) {
          console.error("Invalid token:", err);
        }
      }

      const posts = await forumModel.getAllPosts(userId);
      const ads = await forumModel.getAllAds();
      const jobs = await JobModel.getAllJobs();
      const projects = await ProjectModel.findAll();

      console.log("Current User ID:", userId);
      console.log("Current User Avatar:", currentUserAvatar);
      console.log("Posts before processing:", posts);
      console.log("Ads fetched:", ads);

      // تعديل مسار الصور للمنشورات والإعلانات مع حساب showEditDeleteButtons بشكل منفصل
      const enrichedPosts = await Promise.all(posts.map(async post => {
        const isOwner = userId ? await forumModel.isPostOwner(post.id, userId) : false;
        const liked = userId ? await forumModel.hasLikedPost(post.id, userId) : false;

        return {
          ...post,
          user_avatar: post.user_avatar 
            ? (post.user_avatar.includes('/uploads/avatars/') ? post.user_avatar : `/uploads/avatars/${post.user_avatar}`) 
            : '/uploads/images/pngwing.com.png',
          comments: post.comments ? post.comments.map(comment => ({
            ...comment,
            user_avatar: comment.user_avatar 
              ? (comment.user_avatar.includes('/uploads/avatars/') ? comment.user_avatar : `/uploads/avatars/${comment.user_avatar}`) 
              : '/uploads/images/pngwing.com.png'
          })) : [],
          showEditDeleteButtons: isOwner,
          liked: liked
        };
      }));

      const enrichedAds = ads.map(ad => ({
        ...ad,
        user_avatar: ad.user_avatar 
          ? (ad.user_avatar.includes('/uploads/avatars/') ? ad.user_avatar : `/uploads/avatars/${ad.user_avatar}`) 
          : '/uploads/images/pngwing.com.png'
      }));

      console.log("Posts after processing:", enrichedPosts);

      res.render("forum", { 
        posts: enrichedPosts, 
        ads: enrichedAds, 
        jobs, 
        projects, 
        currentUserId: userId, 
        currentUserAvatar, 
        currentUserName 
      });
    } catch (err) {
      console.error("Error in getAllPosts:", err);
      res.status(500).send("An error occurred while fetching posts.");
    }
  }

  static async getPostDetails(req, res) {
    try {
      const token = req.cookies.token;
      let userId = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, "your_jwt_secret");
          userId = decoded.id;
        } catch (err) {
          console.error("Invalid token:", err);
        }
      }

      const postId = req.params.postId;
      const post = await forumModel.getPostDetails(postId);

      if (!post) {
        return res.status(404).send("المنشور غير موجود.");
      }

      post.user_avatar = post.user_avatar 
        ? (post.user_avatar.includes('/uploads/avatars/') ? post.user_avatar : `/uploads/avatars/${post.user_avatar}`) 
        : '/uploads/images/pngwing.com.png';
      post.comments = post.comments ? post.comments.map(comment => ({
        ...comment,
        user_avatar: comment.user_avatar 
          ? (comment.user_avatar.includes('/uploads/avatars/') ? comment.user_avatar : `/uploads/avatars/${comment.user_avatar}`) 
          : '/uploads/images/pngwing.com.png'
      })) : [];

      res.render("postDetails", { post, currentUserId: userId });
    } catch (err) {
      console.error("Error fetching post details:", err);
      res.status(500).send("An error occurred while fetching post details.");
    }
  }

  static async addProject(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;

      const { title, description, budget, duration } = req.body;

      const projectData = {
        title,
        description,
        budget,
        duration,
        user_id: userId,
      };

      await ProjectModel.create(projectData);
      res.redirect("/forum");
    } catch (err) {
      console.error("Error in addProject:", err);
      res.status(500).send("An error occurred while adding the project.");
    }
  }

  static async getProjectDetails(req, res) {
    try {
      const token = req.cookies.token;
      let userId = null;

      if (token) {
        try {
          const decoded = jwt.verify(token, "your_jwt_secret");
          userId = decoded.id;
        } catch (err) {
          console.error("Invalid token:", err);
        }
      }

      const projectId = parseInt(req.params.id, 10);
      console.log(`Attempting to fetch project with ID: ${projectId}`);

      const project = await ProjectModel.findById(projectId);
      console.log("Project fetched:", project);

      if (!project) {
        console.log(`No project found with ID: ${projectId}`);
        return res.status(404).send("المشروع غير موجود.");
      }

      res.render("projectDetails", { project, currentUserId: userId });
    } catch (err) {
      console.error("Error fetching project details:", err);
      res.status(500).send("An error occurred while fetching project details.");
    }
  }

  static async uploadAvatar(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;

      const avatar = req.file ? req.file.filename : null;
      if (avatar) {
        await forumModel.uploadAvatar(userId, avatar);
        res.redirect(`/profile?userId=${userId}`);
      } else {
        res.status(400).send("Avatar image is required.");
      }
    } catch (err) {
      console.error("Error in uploadAvatar:", err);
      res.status(500).send("An error occurred while uploading the avatar.");
    }
  }

  static async renderProfile(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).send("معرف المستخدم مفقود.");
      }

      const user = await forumModel.getUserById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      user.avatar = user.avatar 
        ? (user.avatar.includes('/uploads/avatars/') ? user.avatar : `/uploads/avatars/${user.avatar}`) 
        : '/uploads/images/pngwing.com.png';

      console.log("Rendering profile for user:", { userId, user });
      res.render("profile", { user });
    } catch (err) {
      console.error("❌ Error rendering profile:", err);
      res.status(500).send("حدث خطأ أثناء عرض البروفايل.");
    }
  }
  static async getUserPosts(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).send("User ID is required. Please log in.");
      }
      const userId = req.user.id;

      const posts = await forumModel.getUserPosts(userId);

      const enrichedPosts = await Promise.all(posts.map(async post => {
        const isOwner = await forumModel.isPostOwner(post.id, userId);
        const liked = await forumModel.hasLikedPost(post.id, userId);

        return {
          ...post,
          user_avatar: post.user_avatar 
            ? (post.user_avatar.includes('/uploads/avatars/') ? post.user_avatar : `/uploads/avatars/${post.user_avatar}`) 
            : '/uploads/images/pngwing.com.png',
          showEditDeleteButtons: isOwner,
          liked: liked
        };
      }));

      const userInfo = await forumModel.getUserById(userId);
      const currentUserAvatar = userInfo.avatar 
        ? (userInfo.avatar.includes('/uploads/avatars/') ? userInfo.avatar : `/uploads/avatars/${userInfo.avatar}`) 
        : '/uploads/images/pngwing.com.png';
      const currentUserName = userInfo.name;

      res.render("userPosts", { 
        posts: enrichedPosts, 
        currentUserId: userId, 
        currentUserAvatar, 
        currentUserName 
      });
    } catch (err) {
      console.error("Error in getUserPosts:", err);
      res.status(500).send("An error occurred while fetching user posts.");
    }
  }
}

module.exports = ForumController;