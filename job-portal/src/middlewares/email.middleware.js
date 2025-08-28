import { transporter } from "../config/mail.js";

export async function sendConfirmationEmail(req, res, next) {
  const applicant = res.locals.applicant;
  const job = res.locals.job;

  if (!applicant || !job) return next();

  try {
    await transporter.sendMail({
      from: `"Easily Jobs" <${process.env.MAIL_USER}>`,
      to: applicant.email,
      subject: `Application Received: ${job.job_designation} at ${job.company_name}`,
      text: `Hi ${applicant.name}, we received your application.`,
      html: `<p>Hi ${applicant.name},</p><p>We received your application for <b>${job.job_designation}</b> at <b>${job.company_name}</b>.</p>`
    });
  } catch (e) {
    console.error("Email error:", e.message);
  }

  next();
}
