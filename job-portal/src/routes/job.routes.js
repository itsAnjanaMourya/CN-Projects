import { Router } from "express";
import {
  listJobs, newJobForm, createJobPost, showJob, editJobForm, deleteJobDel, listApplicants, applyToJob, getUpdateJob, postUpdateJob
} from "../controllers/job.controller.js";
import { authRequired, recruiterOnly } from "../middlewares/auth.middleware.js";
import { jobValidators, applyValidators } from "../middlewares/validate.middleware.js";
import { uploadResume } from "../middlewares/upload.middleware.js";
import { sendConfirmationEmail } from "../middlewares/email.middleware.js";

const r = Router();

// API-style
r.get("/", listJobs);
r.get("/postjob", recruiterOnly, newJobForm);
r.post("/", authRequired, jobValidators, createJobPost);
r.get("/:id", showJob);
r.get("/:id/edit", authRequired, editJobForm);
r.get("/update/:id", authRequired, jobValidators, getUpdateJob);
r.post("/update/:id", authRequired, jobValidators, postUpdateJob);
r.post("/:id", authRequired, deleteJobDel);

// applicants (recruiter)
r.get("/:id/applicants", authRequired, listApplicants);

// apply (seeker)
r.post(
  "/:id/apply",
  uploadResume.single("resume"),
  applyValidators,
  applyToJob,             
  sendConfirmationEmail,   
  (req, res) => {
    const job = res.locals.job; 
    res.render("pages/jobs/show", {
      title: job.job_designation,
      user: req.session.user,
      job,
      success: "Application submitted! Check your email for confirmation."
    });
  }
);
export default r;
