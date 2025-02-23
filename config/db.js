const mysql = require("mysql");
const util = require("util");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "sedik",
});

// الاتصال بقاعدة البيانات
db.connect((err) => {
  if (err) {
    console.error("لم يتم الاتصال بقاعدة البيانات :", err);
    return;
  }
  console.log("db connected on");
});

// تحويل db.query إلى Promise حتى يعمل مع async/await
db.query = util.promisify(db.query);

module.exports = db;
