import express from "express";
import userRoutes from "./routes/users.routes.js";
import restaurantRoutes from "./routes/restaurants.routes.js";
import socialRoutes from "./routes/social.routes.js";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Configurar ruta estática de profile pictures
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(restaurantRoutes);
app.use(userRoutes);
app.use(socialRoutes);
app.use("/img/user", express.static(path.resolve(process.cwd(), "db/img/user")));
app.use("/img/restaurant", express.static(path.resolve(process.cwd(), "db/img/restaurants/profile")));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));


app.listen(process.env.APIPORT, () => {
  console.log(`Server is running on http://localhost:${process.env.APIPORT}`);
});
