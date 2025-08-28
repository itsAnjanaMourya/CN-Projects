import { v4 as uuid } from "uuid";

const jobs = []; 

export function getAllJobs() { return jobs; }

export function createJob(recruiterId, data) {
  const job = {
    id: uuid(),
    recruiterId,
    ...data,
    jobposted: new Date(),
    applicants: []
  };
  jobs.push(job);
  return job;
}

export function findJobById(id) { return jobs.find(j => j.id === id); }

export function updateJob(id, recruiterId, updates) {
  const job = findJobById(id);
  if (!job) return null;
  if (job.recruiterId !== recruiterId) throw new Error("Forbidden");
  Object.assign(job, updates);
  return job;
}

export function deleteJob(jobId, recruiterId) {
  const index = jobs.findIndex(job => job.id === jobId && job.recruiterId === recruiterId);
  if (index === -1) {
    throw new Error("Job not found or you don't have permission to delete it");
  }
  jobs.splice(index, 1);
}

// applicants
export function addApplicant(jobId, applicant) {
  const job = findJobById(jobId);
  if (!job) return null;
  job.applicants.push(applicant);
  return applicant;
}

export function getApplicants(jobId) {
  const job = findJobById(jobId);
  return job ? job.applicants : null;
}
