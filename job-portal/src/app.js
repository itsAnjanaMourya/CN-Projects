import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import expressLayouts from 'express-ejs-layouts';
import path from "path";
import viewRoutes from './routes/view.routes.js';
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import { fileURLToPath } from "url";
// later you’ll add userRoutes and jobRoutes as well

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // form parsing
app.use(express.json()); // JSON parsing
app.use(cookieParser());

// Session setup
app.use(
  session({
    secret: 'supersecretkey', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, 
  })
);

// EJS setup
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static('public'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Global variables for all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.title = "Easily Jobs"; // default title
  next();
});

// Routes
app.use('/', viewRoutes);
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);



// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { error: 'Page Not Found' });
});

export default app;
