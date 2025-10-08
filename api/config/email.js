import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ganeshghatti6@gmail.com", // your Gmail
    pass: process.env.EMAIL_PASS, // 16-char app password
  },
});
