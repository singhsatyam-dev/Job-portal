import express from "express";
import JobController from "../controllers/job.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validateJob } from "../middlewares/validation.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const jobController = new JobController();

const jobRouter = express.Router();

jobRouter.get("/jobs", jobController.showJobs);

// apply job
jobRouter.post(
  "/jobs/apply/:id",
  upload.single("resume"),
  jobController.applyJob
);

// after login for recruiter
jobRouter.get("/jobs/create", isAuthenticated, jobController.getCreateJob);
jobRouter.post(
  "/jobs/create",
  isAuthenticated,
  validateJob,
  jobController.postCreateJob
);

// Recruiter routes (protected)
jobRouter.get("/my-jobs", isAuthenticated, jobController.recruiterDashboard);
jobRouter.get("/jobs/edit/:id", isAuthenticated, jobController.getEditJob);
jobRouter.post("/jobs/edit/:id", isAuthenticated, jobController.postEditJob);
jobRouter.get("/jobs/delete/:id", isAuthenticated, jobController.removeJob);

jobRouter.get(
  "/jobs/:id/applicants",
  isAuthenticated,
  jobController.viewApplicants
);

jobRouter.get("/jobs/:id", jobController.jobDetails);

export default jobRouter;
