import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import slipRoutes from "./routes/slips.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

//routes
app.use("/api/slips", slipRoutes);

//start server
const PORT = 4001;
connectDB();
// .then(() => {
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });
