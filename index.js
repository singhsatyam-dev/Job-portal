import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/auth.routes.js";
import jobRouter from "./routes/job.routes.js";
import { isAuthenticated } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: "job_portal_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(router);

app.use(jobRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//setting landing page route
app.get("/", (req, res) => {
  res.render("jobs/landing", {
    title: "Job Portal",
  });
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("auth/dashboard", {
    title: "Dashboard",
    user: req.session.user,
    lastVisit: req.cookies.lastVisit,
  });
});

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
