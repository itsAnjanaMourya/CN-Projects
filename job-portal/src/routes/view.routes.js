import { Router } from "express";
const router = Router();
router.get("/", (req, res) => res.render("pages/landing", { title: "Home", user: req.session.user || null }));
export default router;