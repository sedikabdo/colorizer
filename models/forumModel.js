const db = require("../config/db");

class ForumModel {
  static async addPost(userId, content, images) {
    const query = `
      INSERT INTO postsforum (user_id, content, image1, image2, image3, image4, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const imageValues = Array(4).fill(null);
    images.forEach((image, index) => {
      if (index < 4) imageValues[index] = image;
    });

    return new Promise((resolve, reject) => {
      db.query(query, [userId, content, ...imageValues], (err, result) => {
        if (err) {
          console.error("Error adding post:", err);
          return reject(new Error("Error adding post"));
        }
        resolve(result);
      });
    });
  }

  static async deletePost(postId) {
    const query = `DELETE FROM postsforum WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId], (err, result) => {
        if (err) {
          console.error("Error deleting post:", err);
          return reject(new Error("Error deleting post"));
        }
        resolve(result);
      });
    });
  }

  static async editPost(postId, content, images) {
    const query = `
      UPDATE postsforum 
      SET content = ?, image1 = ?, image2 = ?, image3 = ?, image4 = ? 
      WHERE id = ?
    `;
    const imageValues = Array(4).fill(null);
    images.forEach((image, index) => {
      if (index < 4) imageValues[index] = image;
    });

    return new Promise((resolve, reject) => {
      db.query(query, [content, ...imageValues, postId], (err, result) => {
        if (err) {
          console.error("Error updating post:", err);
          return reject(new Error("Error updating post"));
        }
        resolve(result);
      });
    });
  }

  static async toggleLike(postId, userId) {
    const checkQuery = `SELECT * FROM likes WHERE post_id = ? AND user_id = ?`;
    const addQuery = `INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, NOW())`;
    const deleteQuery = `DELETE FROM likes WHERE post_id = ? AND user_id = ?`;

    return new Promise((resolve, reject) => {
      db.query(checkQuery, [postId, userId], (err, result) => {
        if (err) {
          console.error("Error checking like:", err);
          return reject(new Error("Error checking like"));
        }
        if (result.length > 0) {
          db.query(deleteQuery, [postId, userId], (delErr) => {
            if (delErr) {
              console.error("Error deleting like:", delErr);
              return reject(new Error("Error deleting like"));
            }
            resolve(false);
          });
        } else {
          db.query(addQuery, [postId, userId], (addErr) => {
            if (addErr) {
              console.error("Error adding like:", addErr);
              return reject(new Error("Error adding like"));
            }
            resolve(true);
          });
        }
      });
    });
  }

  static async getLikeCount(postId) {
    const query = `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId], (err, result) => {
        if (err) {
          console.error("Error getting like count:", err);
          return reject(new Error("Error getting like count"));
        }
        resolve(result[0].like_count);
      });
    });
  }

  static async addComment(postId, userId, content) {
    const query = `INSERT INTO commentsforum (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId, userId, content], (err, result) => {
        if (err) {
          console.error("Error adding comment:", err);
          return reject(new Error("Error adding comment"));
        }
        resolve(result);
      });
    });
  }

  static async getComments(postId) {
    const query = `
      SELECT c.content, c.created_at, u.id AS user_id, u.name AS user_name, 
             IFNULL(u.avatar, '/uploads/images/pngwing.com.png') AS user_avatar
      FROM commentsforum c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [postId], (err, results) => {
        if (err) {
          console.error("Error fetching comments:", err);
          return reject(new Error("Error fetching comments"));
        }
        resolve(results);
      });
    });
  }

  static async getUserById(userId) {
    const query = `
      SELECT id, name, avatar, email
      FROM users
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error("Error fetching user by ID:", err);
          return reject(new Error("Error fetching user"));
        }
        resolve(results[0] || null);
      });
    });
  }

  static async toggleLikeComment(commentId, userId) {
    const checkQuery = `SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?`;
    const addQuery = `INSERT INTO comment_likes (comment_id, user_id, created_at) VALUES (?, ?, NOW())`;
    const deleteQuery = `DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?`;

    return new Promise((resolve, reject) => {
      db.query(checkQuery, [commentId, userId], (err, result) => {
        if (err) {
          console.error("Error checking like on comment:", err);
          return reject(new Error("Error checking like on comment"));
        }
        if (result.length > 0) {
          db.query(deleteQuery, [commentId, userId], (delErr) => {
            if (delErr) {
              console.error("Error deleting like on comment:", delErr);
              return reject(new Error("Error deleting like on comment"));
            }
            resolve(false);
          });
        } else {
          db.query(addQuery, [commentId, userId], (addErr) => {
            if (addErr) {
              console.error("Error adding like on comment:", addErr);
              return reject(new Error("Error adding like on comment"));
            }
            resolve(true);
          });
        }
      });
    });
  }

  static async getAllPosts(userId) {
    const query = `
      SELECT p.id, p.content, p.image1, p.image2, p.image3, p.image4,
             p.created_at, u.id AS user_id, u.name AS user_name, 
             IFNULL(u.avatar, '/uploads/images/pngwing.com.png') AS user_avatar,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
             (SELECT COUNT(*) FROM commentsforum WHERE post_id = p.id) AS comment_count
      FROM postsforum p
      JOIN users u ON p.user_id = u.id
      WHERE p.id NOT IN (SELECT post_id FROM hidden_posts WHERE user_id = ? OR user_id IS NULL)
      ORDER BY p.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId || null], (err, results) => {
        if (err) {
          console.error("Error fetching all posts:", err);
          return reject(new Error("Error fetching posts"));
        }
        resolve(results);
      });
    });
  }

  static async getPostDetails(postId) {
    const query = `
      SELECT p.id, p.content, p.image1, p.image2, p.image3, p.image4,
             p.created_at, u.id AS user_id, u.name AS user_name, u.avatar AS user_avatar
      FROM postsforum p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [postId], (err, results) => {
        if (err) {
          console.error("Error fetching post details:", err);
          return reject(new Error("Error fetching post details"));
        }
        resolve(results[0]);
      });
    });
  }

  static async hidePost(userId, postId) {
    const query = `INSERT INTO hidden_posts (user_id, post_id) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, postId], (err, result) => {
        if (err) {
          console.error("Error hiding post:", err);
          return reject(new Error("Error hiding post"));
        }
        resolve(result);
      });
    });
  }

  static async checkHiddenPost(userId, postId) {
    const query = `SELECT * FROM hidden_posts WHERE user_id = ? AND post_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, postId], (err, result) => {
        if (err) {
          console.error("Error checking if post is hidden:", err);
          return reject(new Error("Error checking if post is hidden"));
        }
        resolve(result.length > 0);
      });
    });
  }

  static async isPostOwner(postId, userId) {
    const query = `SELECT * FROM postsforum WHERE id = ? AND user_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId, userId], (err, result) => {
        if (err) {
          console.error("Error checking if post is owned by user:", err);
          return reject(new Error("Error checking if post is owned by user"));
        }
        resolve(result.length > 0);
      });
    });
  }

  static async hasLikedPost(postId, userId) {
    const query = `SELECT * FROM likes WHERE post_id = ? AND user_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [postId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.length > 0);
      });
    });
  }

  static async sharePost(userId, postId) {
    const query = `INSERT INTO shares (user_id, post_id, created_at) VALUES (?, ?, NOW())`;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, postId], (err, result) => {
        if (err) {
          console.error("Error sharing post:", err);
          return reject(new Error("Error sharing post"));
        }
        resolve(result);
      });
    });
  }

  static async uploadAvatar(userId, avatar) {
    const query = `UPDATE users SET avatar = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [avatar, userId], (err, result) => {
        if (err) {
          console.error("Error uploading avatar:", err);
          return reject(new Error("Error uploading avatar"));
        }
        resolve(result);
      });
    });
  }

  static async getUserAvatar(userId) {
    return this.getUserById(userId);
  }

  static async addAd(userId, title, description, image) {
    const query = `
      INSERT INTO ads (user_id, title, description, image, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId, title, description, image], (err, result) => {
        if (err) {
          console.error("Error adding ad:", err);
          return reject(new Error("Error adding ad"));
        }
        resolve(result.insertId);
      });
    });
  }

  static async getAllAds() {
    const query = `
      SELECT a.id, a.title, a.description, a.image, a.created_at, u.name AS user_name, u.avatar AS user_avatar
      FROM ads a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching ads:", err);
          return reject(new Error("Error fetching ads"));
        }
        resolve(results);
      });
    });
  }
  // دالة لحذف الإعلانات التي مر عليها أكثر من 24 ساعة
  static async deleteOldAds() {
    const query = `
      DELETE FROM ads 
      WHERE created_at < NOW() - INTERVAL 24 HOUR
    `;
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          console.error("Error deleting old ads:", err);
          return reject(new Error("Error deleting old ads"));
        }
        console.log(`Deleted ${result.affectedRows} old ads`);
        resolve(result);
      });
    });
  }

  // دالة للتحقق من عدد الإعلانات اليومية للمستخدم
  static async getDailyAdCount(userId) {
    const query = `
      SELECT COUNT(*) AS ad_count 
      FROM ads 
      WHERE user_id = ? 
      AND DATE(created_at) = CURDATE()
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
        if (err) {
          console.error("Error fetching daily ad count:", err);
          return reject(new Error("Error fetching daily ad count"));
        }
        resolve(result[0].ad_count);
      });
    });
  }
  static async getUserPosts(userId) {
    const query = `
      SELECT p.id, p.content, p.image1, p.image2, p.image3, p.image4,
             p.created_at, u.id AS user_id, u.name AS user_name, 
             IFNULL(u.avatar, '/uploads/images/pngwing.com.png') AS user_avatar,
             (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
             (SELECT COUNT(*) FROM commentsforum WHERE post_id = p.id) AS comment_count
      FROM postsforum p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error("Error fetching user posts:", err);
          return reject(new Error("Error fetching user posts"));
        }
        resolve(results);
      });
    });
  }
}

module.exports = ForumModel;