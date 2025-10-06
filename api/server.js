import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/course.js";
import paymentRoutes from "./routes/payment.js";
import adminRoutes from "./routes/admin.js";
import categoryRoutes from "./routes/category.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://admin.futuremindsinstitute.com",
      "https://futuremindsinstitute.com",
      "https://www.futuremindsinstitute.com",
      "http://localhost",
      "https://localhost",
  ], // Add your frontend URLs
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limiting - applies to all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 200 requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply global rate limiting to all requests
app.use(globalLimiter);

app.use("/auth", authRoutes);
app.use("/course", courseRoutes);
app.use("/payment", paymentRoutes);
app.use("/admin", adminRoutes);
app.use("/category", categoryRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});



app.get("/test", async (req, res) => {
  try {
    res.send("Hello World");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error starting TensorStudio test.");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
