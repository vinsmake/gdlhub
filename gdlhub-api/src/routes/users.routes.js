import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, loginUser, updateUser, registerUser, verifyEmailAndRegister, uploadUserAvatar, getUserSavedRestaurants, getUserFollowing, updateProfile } from "../controllers/users.controllers.js";
import { getUserRecommendations } from "../controllers/users.controllers.js";
import { uploadAvatar, uploadProfile as uploadProfileMiddleware, handleMulterError } from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

/* Routes */
/* Get users */
/* Routes específicas primero */
router.post("/login", loginUser);
router.post("/register", uploadAvatar.single('avatar'), handleMulterError, registerUser);
router.post("/verify-email", verifyEmailAndRegister);
router.post("/upload-avatar", uploadAvatar.single('avatar'), handleMulterError, uploadUserAvatar);
router.put("/users/profile", verifyToken, uploadProfileMiddleware.single('profileImage'), handleMulterError, updateProfile);

/* Routes generales después */
router.get("/users", getUsers);
router.get("/users/:uid", getUserById);
router.post("/users", createUser);
router.delete("/users/:uid", deleteUser);
router.put("/users/:uid", updateUser);
router.get("/users/:uid/recommendations", getUserRecommendations);
router.get("/users/:uid/saved-restaurants", getUserSavedRestaurants);
router.get("/users/:uid/following", getUserFollowing);

export default router;