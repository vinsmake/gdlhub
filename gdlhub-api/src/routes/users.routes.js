import { Router } from "express";

const router = Router();

/* Routes */
/* Get users */
router.get("/users", (req, res) => {
    res.send("Getting users");
});

/* Get users by id */
router.get("/users/:UserId", (req, res) => {
    const { UserId } = req.params;
    res.send("Getting user by id: " + UserId);
});

/* Create user */
router.post("/users", (req, res) => {
    res.send("Posting users");
});

/* Delete user */
router.delete("/users/:UserId", (req, res) => {
    res.send("Deleting user by id: " + req.params.UserId);
});

/* Put users */
router.put("/users/:UserId", (req, res) => {
    const { UserId } = req.params;
    res.send("Putting users " + req.params.UserId);
});



export default router;