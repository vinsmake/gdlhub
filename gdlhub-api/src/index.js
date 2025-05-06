import express from "express";
import userRoutes from "./routes/users.routes.js";
import restaurantRoutes from "./routes/restaurants.routes.js";
import { PORT } from "./config.js";
import morgan from "morgan";
import cors from "cors";


const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(userRoutes);
app.use(restaurantRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
