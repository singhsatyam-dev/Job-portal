import JobModel from "../models/job.model.js";
import { sendConfirmationMail } from "../middlewares/mail.middleware.js";

export default class JobController {
  //all jobs
  showJobs(req, res) {
    const { search, page = 1 } = req.query;
    const limit = 5;

    let jobs = search ? JobModel.jobSearch(search) : JobModel.getAllJobs();

    const totalPages = Math.ceil(jobs.length / limit);
    const currentPage = Number(page);

    const paginatedJobs = jobs.slice(
      (currentPage - 1) * limit,
      currentPage * limit
    );

    res.render("jobs/list", {
      title: "All Jobs",
      jobs: paginatedJobs,
      currentPage,
      totalPages,
      search,
    });
  }

  //job posted by recruiter
  recruiterDashboard(req, res) {
    const jobs = JobModel.getJobByRecruiter(req.session.user.email);

    res.render("jobs/dashboard", {
      title: "My Jobs",
      jobs,
    });
  }

  // for creating job
  getCreateJob(req, res) {
    console.log("Create Job page hit");
    res.render("jobs/create", { title: "Create Job" });
  }

  postCreateJob(req, res) {
    const { title, company, location, description } = req.body;

    JobModel.createJob({
      title,
      company,
      location,
      description,
      createdBy: req.session.user.email,
    });

    res.redirect("/my-jobs");
  }

  jobDetails(req, res) {
    const job = JobModel.getJobById(req.params.id);
    if (!job) return res.status(404).render("404", { title: "Not Found" });

    res.render("jobs/details", {
      title: "Job Details",
      job,
    });
  }

  getEditJob(req, res) {
    const job = JobModel.getJobById(req.params.id);

    if (!job || job.createdBy !== req.session.user.email) {
      return res.send("Unauthorized");
    }

    res.render("jobs/edit", {
      title: "Edit Job",
      job,
    });
  }

  postEditJob(req, res) {
    const job = JobModel.getJobById(req.params.id);

    if (!job || job.createdBy !== req.session.user.email) {
      return res.send("Unauthorized");
    }

    JobModel.updateJob(req.params.id, req.body);
    res.redirect("/my-jobs");
  }

  // applying for the job
  applyJob(req, res) {
    console.log("✅ APPLY JOB ROUTE HIT", req.params.id);

    const { name, email } = req.body;
    const jobId = req.params.id;

    if (!req.file) {
      return res.status(400).send("Resume is required");
    }

    const success = JobModel.addApplicant(jobId, {
      name,
      email,
      resume: req.file.filename,
    });

    if (!success) {
      return res.status(404).render("404", { title: "Job Not Found" });
    }

    const job = JobModel.getJobById(jobId);

    try {
      sendConfirmationMail(email, job.title);
    } catch (err) {
      console.log("Email failed:", err.message);
    }

    return res.render("jobs/success", {
      title: "Application Submitted",
    });
  }

  // applicants
  viewApplicants(req, res) {
    const applicants = JobModel.getApplicants(req.params.id);

    res.render("jobs/applicants", {
      title: "Applicants",
      applicants,
    });
  }

  removeJob(req, res) {
    const job = JobModel.getJobById(req.params.id);

    if (!job || job.createdBy !== req.session.user.email) {
      return res.send("Unauthorized");
    }

    JobModel.deleteJob(req.params.id);
    res.redirect("/my-jobs");
  }
}
