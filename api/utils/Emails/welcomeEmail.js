import { transporter } from "../../config/email";
import { welcomeTemplate } from "../email_templates/welcomeEmailtemplate";

export const SendWelcomeEmail = async ({ email, username }) => {
  try {
    await transporter.verify();

    const htmlcontent = welcomeTemplate(username);
    const mailOptions = {
      from: `Future Minds Institute <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Future Minds Institute",
      html: htmlcontent,
    };

    await transporter.sendMail(mailOptions);
    return { message: "welcome email send successfully" };
  } catch (error) {
    return {message : "error while sending welcome email"};
  }
};
