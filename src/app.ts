import express, { Application } from "express";
import path from "path";

// Import all routers
import apiRoutes from "./routes/api/"; // REST API routes
import webProfileRoutes from "./routes/web/profile"; // Web UI route (EJS view)

const app: Application = express();

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use(express.static(path.resolve('./public')));


// ===== View Engine =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== Routes =====
app.use("/", webProfileRoutes); // web UI routes
app.use("/api", apiRoutes); // all REST API routes

export default app;
