import express from "express";
import { followUser, getMutualFeed, getRestaurantComments, isFollowing, isSavedRestaurant, saveRestaurant, unfollowUser, unsaveRestaurant } from "../controllers/social.controllers.js";
import { addRestaurantComment } from "../controllers/social.controllers.js";
import { getUserFeed } from "../controllers/social.controllers.js";
import { getFollowingUsers, getFavoriteRestaurants } from "../controllers/social.controllers.js";
import { getGlobalFeed } from "../controllers/social.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

// Comentarios por restaurante
router.get("/restaurants/:rid/comments", getRestaurantComments);
router.post("/restaurants/:rid/comments", verifyToken, addRestaurantComment);
router.get("/users/:id/feed", getUserFeed);
router.get("/users/:id/following", getFollowingUsers);
router.get("/users/:id/favorite-restaurants", getFavoriteRestaurants);
router.get("/feed", getGlobalFeed);
router.get("/users/:id/friends", getMutualFeed);
router.post("/users/:id/follow", verifyToken, followUser);
router.delete("/users/:id/follow", verifyToken, unfollowUser);
router.get("/users/:id/follow", verifyToken, isFollowing);
router.post("/restaurants/:rid/save", verifyToken, saveRestaurant);
router.delete("/restaurants/:rid/save", verifyToken, unsaveRestaurant);
router.get("/restaurants/:rid/save", verifyToken, isSavedRestaurant);


export default router;
