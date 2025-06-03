import express from "express";
import { getRestaurantComments } from "../controllers/social.controllers.js";
import { addRestaurantComment } from "../controllers/social.controllers.js";
import { getUserFeed } from "../controllers/social.controllers.js";
import { getFollowingUsers, getFavoriteRestaurants } from "../controllers/social.controllers.js";

const router = express.Router();

// Comentarios por restaurante
router.get("/restaurants/:rid/comments", getRestaurantComments);
router.post("/restaurants/:rid/comments", addRestaurantComment);
router.get("/users/:id/feed", getUserFeed);
router.get("/users/:id/following", getFollowingUsers);
router.get("/users/:id/favorite-restaurants", getFavoriteRestaurants);


export default router;
