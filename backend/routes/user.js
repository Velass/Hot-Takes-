const express = require("express");
const router = express.Router();
const userControllers = require ("../controllers/user")

//Routes de signup et de login
router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login)

module.exports = router;