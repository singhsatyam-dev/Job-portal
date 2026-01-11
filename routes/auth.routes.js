import express from "express";
import AuthController from "../controllers/auth.controller.js";

const authController = new AuthController();

const router = express.Router();

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/logout", authController.logout);

export default router;