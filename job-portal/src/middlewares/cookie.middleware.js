export function lastVisitTracker(req, res, next) {
  const now = new Date().toISOString();
  if (!req.cookies.lastVisit) res.cookie("lastVisit", now, { httpOnly: false });
  else res.cookie("lastVisit", now, { httpOnly: false }); 
  next();
}
