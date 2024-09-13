const express = require("express");
const router = express.Router();
const { saveData } = require("../controllers/user.controller");

router.post("/saveData", saveData);

module.exports = router;
