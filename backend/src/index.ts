import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRouter from "./auth/routes.js";
import notesRouter from "./notes/routes.js";
import tenantsRouter from "./tenants/routes.js";

const app = express();

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get("/", (req, res) => {
  res
    .json({
      message: "Working",
    })
    .status(200);
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/notes", notesRouter);
app.use("/tenants", tenantsRouter);

export default app;
