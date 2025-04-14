import express from "express";
import userRoutes from "./routes/users.routes.js";
import { PORT } from "./config.js";

const app = express();

app.use(express.json());
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
