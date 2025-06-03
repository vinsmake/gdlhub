import express from "express";
import { getRestaurantComments } from "../controllers/social.controllers.js";

const router = express.Router();

// Comentarios por restaurante
router.get("/restaurants/:rid/comments", getRestaurantComments);

// Otros endpoints sociales pueden ir aquí también

export default router;
