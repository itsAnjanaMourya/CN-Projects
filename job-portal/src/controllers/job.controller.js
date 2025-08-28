import { validationResult } from "express-validator";
import { v4 as uuid } from "uuid";
import {
  getAllJobs,
  findJobById,
  createJob,
  updateJob,
  deleteJob,
  addApplicant,
  getApplicants
} from "../models/job.model.js";

// list all jobs with search 
export function listJobs(req, res) {
  const query = req.query.q ? req.query.q.toLowerCase() : "";
  let jobs = getAllJobs();

  if (query) {
    jobs = jobs.filter(job =>
      job.job_designation.toLowerCase().includes(query) ||
      job.company_name.toLowerCase().includes(query) ||
      job.job_location.toLowerCase().includes(query) ||
      job.skills_required.some(skill => skill.toLowerCase().includes(query))
    );
  }

  res.render("pages/jobs/index", {
    title: "Job Listings",
    user: req.session.user,
    jobs,
    query
  });
}

// show form
export function newJobForm(req, res) {
  res.render("pages/jobs/postJob", {
    title: "Post Job",
    user: req.session.user,
    errors: null
  });
}

// handle new job creation
export function createJobPost(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("pages/jobs/postJob", {
      title: "Post Job",
      user: req.session.user,
      errors: errors.array()
    });
  }

  const recruiterId = req.session.user.id;

  const payload = {
    job_category: req.body.job_category,
    job_designation: req.body.job_designation,
    job_location: req.body.job_location,
    company_name: req.body.company_name,
    salary: req.body.salary,
    apply_by: req.body.apply_by,
    skills_required: Array.isArray(req.body.skills_required)
      ? req.body.skills_required
      : [req.body.skills_required],
    number_of_openings: Number(req.body.number_of_openings || 1),
    createdAt: new Date(),
  };

  const job = createJob(recruiterId, payload);
  res.redirect(`/jobs/${job.id}`);
}

// show single job
export function showJob(req, res) {
  const job = findJobById(req.params.id);
  if (!job) return res.status(404).render("404");
  res.render("pages/jobs/show", {
    title: job.job_designation,
    user: req.session.user,
    job
  });
}

// edit job form
export function editJobForm(req, res) {
  const job = findJobById(req.params.id);
  if (!job) return res.status(404).render("404");
  if (job.recruiterId !== req.session.user.id) return res.status(403).render("404");

  res.render("pages/jobs/edit", {
    title: "Edit Job",
    user: req.session.user,
    job,
    errors: null
  });
}

// update job
// GET update job form
export function getUpdateJob(req, res) {
  const jobId = req.params.id;
  const job = findJobById(jobId);

  if (!job || job.recruiterId !== req.session.user.id) {
    return res.status(403).render("404", { error: "Job not found or you don't have permission" });
  }

  res.render("pages/jobs/updateJob", {
    title: "Update Job",
    user: req.session.user,
    job
  });
}

// POST update job form
export function postUpdateJob(req, res) {
  const jobId = req.params.id;
  try {
    const updatedJob = updateJob(jobId, req.session.user.id, {
      job_category: req.body.job_category,
      job_designation: req.body.job_designation,
      job_location: req.body.job_location,
      company_name: req.body.company_name,
      salary: req.body.salary,
      number_of_openings: Number(req.body.number_of_openings || 1),
      skills_required: Array.isArray(req.body.skills_required)
        ? req.body.skills_required
        : [req.body.skills_required],
      apply_by: req.body.apply_by
    });

    if (!updatedJob) {
      return res.status(404).render("404", { error: "Job not found" });
    }

    res.redirect(`/jobs/${jobId}`);
  } catch (e) {
    return res.status(403).render("404", { error: e.message });
  }
}


// // delete job
export function deleteJobDel(req, res) {
  try {
    deleteJob(req.params.id, req.session.user.id);
    res.redirect("/jobs");
  } catch (e) {
    res.status(403).render("404", { error: e.message });
  }
}


// applicants
export function listApplicants(req, res) {
  const applicants = getApplicants(req.params.id);
  const job = findJobById(req.params.id);
  if (!job) return res.status(404).render("404");
  if (!req.session.user || job.recruiterId !== req.session.user.id)
    return res.status(403).render("404");

  res.render("pages/applicants", {
    title: "Applicants",
    user: req.session.user,
    job,
    applicants
  });
}

export function applyToJob(req, res, next) {
  const job = findJobById(req.params.id);
  if (!job) return res.status(404).render("404");

  const applicant = {
    applicantid: uuid(),
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
    resumePath: req.file ? `/uploads/resumes/${req.file.filename}` : null,
    job, 
    company_name: job.company_name
  };

  addApplicant(req.params.id, applicant);

  // make applicant available to next middleware (sendConfirmationEmail)
  res.locals.job = job;
  res.locals.applicant = applicant;

  // continue to email sender
  next();
}

