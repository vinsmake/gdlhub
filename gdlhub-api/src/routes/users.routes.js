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
    res.json(rows[0]);
});

/* Create user */
router.post("/users", async (req, res) => {
    const data = req.body;
    const {rows} = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [data.name, data.email]);
    return res.json(rows[0]);
});

/* Delete user */
router.delete("/users/:uid", async (req, res) => {
    const { uid } = req.params;
    const {rows, rowCount} = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [uid]);

    if (rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.sendStatus(204);
});

/* Put users */
router.put("/users/:uid", async (req, res) => {
    const { uid } = req.params;
    const data = req.body;
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [data.name, data.email, uid]);
    res.send("actualizando usuario con id: " + uid);
});



export default router;