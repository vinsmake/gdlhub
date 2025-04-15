import { pool } from "../db.js";


export const getUsers = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM users")
    res.json(rows);
}

export const getUserById = async (req, res) => {
    const { uid } = req.params;
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [uid]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
}

export const createUser = async (req, res) => {

    try {
        const data = req.body;
        const { rows } = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [data.name, data.email]);
        return res.json(rows[0]);
    } catch (error) {

        if (error?.code === '23505') {
            return res.status(409).json({ message: "Email already registered" });
        }

        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });        
    }

}

export const deleteUser = async (req, res) => {
    const { uid } = req.params;
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [uid]);

    if (rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.sendStatus(204);
}

export const updateUser = async (req, res) => {
    const { uid } = req.params;
    const data = req.body;
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [data.name, data.email, uid]);
    res.send("actualizando usuario con id: " + uid);
}