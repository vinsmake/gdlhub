import { Router } from "express";
import { pool } from "../db.js";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/users.controllers.js";

const router = Router();

/* Routes */
/* Get users */
router.get("/users", getUsers);

/* Get users by id */
router.get("/users/:uid", getUserById);

/* Create user */
router.post("/users", createUser);

/* Delete user */
router.delete("/users/:uid", deleteUser);

/* Put users */
router.put("/users/:uid", updateUser);



export default router;