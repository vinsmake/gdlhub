import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, loginUser, updateUser, registerUser, verifyEmailAndRegister, uploadUserAvatar } from "../controllers/users.controllers.js";
import { getUserRecommendations } from "../controllers/users.controllers.js";
import { uploadAvatar, handleMulterError } from "../middleware/uploadMiddleware.js";

const router = Router();

/* Routes */
/* Get users */
router.get("/users", getUsers);
router.get("/users/:uid", getUserById);
router.post("/users", createUser);
router.delete("/users/:uid", deleteUser);
router.put("/users/:uid", updateUser);
router.get("/users/:uid/recommendations", getUserRecommendations);
router.post("/login", loginUser);
router.post("/register", uploadAvatar.single('avatar'), handleMulterError, registerUser);
router.post("/verify-email", verifyEmailAndRegister);
router.post("/upload-avatar", uploadAvatar.single('avatar'), handleMulterError, uploadUserAvatar);

export default router;