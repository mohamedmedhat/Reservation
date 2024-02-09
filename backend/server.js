import express from "express";
import cors from "cors";
import ProductRouter from "./routes/product.js";
import UserRouter from "./routes/user.js";
import dotenv from "dotenv";
import mongoDb from "./config/connect.js";
import path from "path"; // Import path module for resolving file paths

dotenv.config();

const app = express();

// Log requests middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});




/** middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const __dirname = path.dirname(new URL(import.meta.url).pathname);
// app.use("/images", express.static(path.join(__dirname, "uploads")));

app.get("/", express.static(path.join(__dirname, "../public")))


/** routes */
app.use("/products", ProductRouter);
app.use("/users", UserRouter);

/** server */
mongoDb();
try {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running");
  });
} catch (err) {
  console.error("Failed to connect to database");
}
