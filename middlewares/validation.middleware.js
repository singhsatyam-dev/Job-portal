export const validateJob = (req, res, next) => {
  const { title, company, location, description } = req.body;

  if (!title || !company || !location || !description) {
    return res.send("All fields are required");
  }

  next();
};