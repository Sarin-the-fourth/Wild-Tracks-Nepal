import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectdb from "./utils/connectDB.js";
import adminroute from "./routes/admin_routes.js";
import userroute from "./routes/user_routes.js";
import auth_routes from "./routes/auth_routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(cookieParser());
app.use(express.json({ limit: "150mb" }));

app.use("/admin", adminroute);
app.use("/user", userroute);
app.use("/auth", auth_routes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("App is running on port", PORT);
  connectdb();
});
