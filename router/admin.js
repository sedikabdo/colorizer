const express = require("express");
const router = express.Router();

router.get("/adminNotify", (req, res) => {
  res.render("adminNotify");
});

module.exports = router;
