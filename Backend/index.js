import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import stopRoutes from './src/routes/stopRoutes.js';
import activityRoutes from './src/routes/activityRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();
const app=express();
connectToDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trips/:tripId/stops", stopRoutes);
app.use("/api/stops/:stopId/activities", activityRoutes);
app.use("/api/activities", activityRoutes); // For delete which uses /api/activities/:id
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("Server is running on port", PORT);
});