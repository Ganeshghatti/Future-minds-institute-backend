
import { transporter } from "../../config/email";
import { coursePurchaseTemplate } from "../email_templates/CoursePurchasetemplate";

export const sendCoursePurchaseEmail = async (email, username, courseName) => {
  try {
    const htmlContent = coursePurchaseTemplate(username, courseName);

    const mailOptions = {
      from: `"Future Minds Institute" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🎓 You’ve successfully purchased "${courseName}"`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return (`Course purchase email sent to ${userEmail}`);
  } catch (error) {
    return ("Error sending course purchase email:", error);
  }
};
