import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/* Routes */
/* Get users */
router.get("/users", async (req, res) => {
    const {rows} = await pool.query("SELECT * FROM users")    
    res.json(rows);
});

/* Get users by id */
router.get("/users/:uid", (req, res) => {
    const { uid } = req.params;
    res.send("Getting user by id: " + uid);
});

/* Create user */
router.post("/users", (req, res) => {
    res.send("Posting users");
});

/* Delete user */
router.delete("/users/:uid", (req, res) => {
    res.send("Deleting user by id: " + req.params.uid);
});

/* Put users */
router.put("/users/:uid", (req, res) => {
    const { uid } = req.params;
    res.send("Putting user by id " + req.params.uid);
});



export default router;