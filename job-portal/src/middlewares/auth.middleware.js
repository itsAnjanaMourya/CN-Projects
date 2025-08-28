export function authRequired(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/login");
  next();
}
export function redirectIfAuthed(req, res, next) {
  if (req.session.user) return res.redirect("/jobs");
  next();
}

export function recruiterOnly(req, res, next) {
  const user = req.session.user;
  if (!user) {
    return res.status(403).render("404", {
      error: "Only recruiters are allowed to access this page. Please login as a recruiter."
    });
  }
  next();
}
