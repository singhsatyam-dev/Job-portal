import nodemailer from "nodemailer";

export const sendConfirmationMail = async (toEmail, jobTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sinhgsatyam1@gmail.com",
        pass: "cmmvzbtnaqcvexoo",
      },
    });

    const mailOptions = {
      from: `"Job Portal"`,
      to: toEmail,
      subject: "Job Application Confirmation",
      html: `
        <h2>Application Submitted Successfully</h2>
        <p>You have successfully applied for <b>${jobTitle}</b>.</p>
        <p>Our team will contact you if shortlisted.</p>
        <br/>
        <p>Regards,<br/>Job Portal Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to:", toEmail);

  } catch (error) {
    console.error("Email error:", error.message);
  }
};
