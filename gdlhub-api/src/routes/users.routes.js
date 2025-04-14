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
router.get("/users/:uid", async (req, res) => {
    const { uid } = req.params;
    const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [uid]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(rows);
});

/* Create user */
router.post("/users", (req, res) => {
    res.send("Posting users");
});

/* Delete user */
router.delete("/users/:uid", async (req, res) => {
    const { uid } = req.params;
    const {rows, rowCount} = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [uid]);

    console.log(rows);

    if (rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json({message: "User deleted"});
});

/* Put users */
router.put("/users/:uid", (req, res) => {
    const { uid } = req.params;
    res.send("Putting user by id " + req.params.uid);
});



export default router;