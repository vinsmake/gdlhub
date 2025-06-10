import { Router } from "express";
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsBySpecialties,
  searchRestaurants,
  getMenuMeta,
} from "../controllers/restaurants.controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/restaurants/search", searchRestaurants);
router.get("/restaurants/by-specialty", getRestaurantsBySpecialties);


router.get("/restaurants", getRestaurants);
router.get("/restaurants/:rid", getRestaurantById);
router.post("/restaurants", verifyToken, createRestaurant);
router.put("/restaurants/:rid", verifyToken, updateRestaurant);
router.delete("/restaurants/:rid", verifyToken, deleteRestaurant);
router.get("/menu/meta", getMenuMeta);




export default router;
