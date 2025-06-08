import { Router } from "express";
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantsBySpecialties,
  searchRestaurants,
} from "../controllers/restaurants.controllers.js";

const router = Router();

router.get("/restaurants/search", searchRestaurants);
router.get("/restaurants/by-specialty", getRestaurantsBySpecialties);


router.get("/restaurants", getRestaurants);
router.get("/restaurants/:rid", getRestaurantById);
router.post("/restaurants", createRestaurant);
router.put("/restaurants/:rid", updateRestaurant);
router.delete("/restaurants/:rid", deleteRestaurant);



export default router;
