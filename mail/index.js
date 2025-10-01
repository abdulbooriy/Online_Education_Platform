import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASSWORD,
  },
});

async function sendMail({ to, subject, html }) {
  try {
    const data = await transporter.sendMail({
      from: process.env.NODEMAILER_USER_EMAIL,
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export default sendMail;
