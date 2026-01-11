let jobs = [];
let jobIdCounter = 1;

export default class JobModel {
  //all jobs
  static getAllJobs = () => jobs;

  // job by id
  static getJobById = (id) => {
    return jobs.find((job) => job.id === Number(id));
  };

  //create a job
  static createJob = (job) => {
    job.id = jobIdCounter++;
    jobs.push(job);
  };

  //update job
  static updateJob = (id, updatedData) => {
    const job = this.getJobById(id);
    if (!job) return false;

    job.title = updatedData.title;
    job.company = updatedData.company;
    job.location = updatedData.location;
    job.description = updatedData.description;
    return true;
  };

  //del job
  static deleteJob = (id) => {
    jobs = jobs.filter((job) => job.id !== Number(id));
  };

  // job by the recruiter
  static getJobByRecruiter = (email) => {
    return jobs.filter((job) => job.createdBy === email);
  };

  static addApplicant = (jobId, applicant) => {
    const job = this.getJobById(jobId);

    if (!job) return false;

    if (!job.applicants) {
      job.applicants = [];
    }
    job.applicants.push(applicant);
    return true;
  };

  static getApplicants = (jobId) => {
    const job = this.getJobById(jobId);
    return job?.applicants || [];
  };

  static jobSearch = (query) => {
    const q = query.toLowerCase();

    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
    );
  };
}
