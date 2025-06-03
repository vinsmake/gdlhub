import express from "express";
import { getRestaurantComments } from "../controllers/social.controllers.js";
import { addRestaurantComment } from "../controllers/social.controllers.js";


const router = express.Router();

// Comentarios por restaurante
router.get("/restaurants/:rid/comments", getRestaurantComments);
router.post("/restaurants/:rid/comments", addRestaurantComment);


export default router;
