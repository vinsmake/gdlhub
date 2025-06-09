import { Router } from "express";
import { createUser, deleteUser, getUserById, getUsers, loginUser, updateUser } from "../controllers/users.controllers.js";
import { getUserRecommendations } from "../controllers/users.controllers.js";

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



export default router;