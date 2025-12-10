import { Router } from "express";
import authRoutes from "./authRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
const router = Router();
router.use("/auth", authRoutes);
router.use("/settings", settingsRoutes);
export default router;
