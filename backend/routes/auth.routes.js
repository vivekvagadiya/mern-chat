const express = require("express");
const router = express.Router();
const { register, login, refreshToken, logout, getMe } = require("../controller/auth.controller");
const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator.js");
const validateSchema = require("../validators/schema.validator.js");
const authenticate = require("../middleware/auth.middleware.js");

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

module.exports = router;
