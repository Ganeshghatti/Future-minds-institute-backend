import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  // host: process.env.EMAIL_HOST,
  // port: process.env.EMAIL_PORT,
  // secure: true,
  // auth: {
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASS,
  // },

  service: "gmail",
  auth: {
    user: "ganeshghatti6@gmail.com", // your Gmail
    pass: process.env.EMAIL_PASS, // 16-char app password
  },
});

const sendResetPasswordLink = async (email, resetUrl) => {
  try{
    await transporter.verify()
    console.log("SMTP server is ready");

    const mailOptions = {
      from: `Future Minds Institute <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your Future Minds Institute password",
      html: `
      <div style="background:#0f172a;padding:24px 0;margin:0;font-family:Inter,Arial,Helvetica,sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#0b1220;border:1px solid #1f2937;border-radius:12px;overflow:hidden">
          <div style="padding:24px 28px;border-bottom:1px solid #1f2937;background:#0b1220">
            <h1 style="margin:0;color:#10b981;font-size:18px;letter-spacing:.3px;">Future Minds Institute</h1>
            <p style="margin:8px 0 0;color:#94a3b8;font-size:12px;line-height:1.5;">
              You requested a password reset for your account.
            </p>
          </div>
    
          <div style="padding:28px;background:#0b1220;color:#e2e8f0;">
            <p style="margin:0 0 16px;font-size:14px;line-height:1.7;">
              Click the button below to create a new password. For your security, this link will expire in 5 minutes.
            </p>
    
            <div style="text-align:center;margin:24px 0;">
              <a href="${resetUrl}"
                 style="display:inline-block;background:#10b981;color:#0b1220;text-decoration:none;font-weight:600;
                        padding:12px 20px;border-radius:10px;border:1px solid #059669;">
                Reset Password
              </a>
            </div>
    
            <p style="margin:0 0 12px;font-size:12px;color:#94a3b8;">
              If the button doesn’t work, copy and paste this link into your browser:
            </p>
            <p style="margin:0 0 20px;word-break:break-all;">
              <a href="${resetUrl}" style="color:#10b981;text-decoration:underline;">${resetUrl}</a>
            </p>
    
            <div style="margin:18px 0;padding:12px;border:1px dashed #1f2937;border-radius:8px;background:#0a101c;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                Didn’t request this? You can safely ignore this email—your password will remain unchanged.
              </p>
            </div>
    
            <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">
              Need help? Reply to this email or contact our support team.
            </p>
          </div>
    
          <div style="padding:18px 28px;border-top:1px solid #1f2937;background:#0b1220;text-align:center;">
            <p style="margin:0;color:#64748b;font-size:11px;line-height:1.6;">
              © ${new Date().getFullYear()} Future Minds Institute. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    return { success: true };
  }
  catch(error){
    console.error("Error in sendResetPasswordLink:", error);
    return { error: error.message };
  }
}

export default sendResetPasswordLink;