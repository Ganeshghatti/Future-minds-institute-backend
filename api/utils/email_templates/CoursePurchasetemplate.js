export const coursePurchaseTemplate = (username, courseName) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Course Purchase Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background-color: #f4f7fa;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background-color: #16a34a;
          color: #fff;
          text-align: center;
          padding: 24px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          text-align: left;
        }
        .content h2 {
          color: #111827;
        }
        .button {
          display: inline-block;
          background-color: #16a34a;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          margin-top: 20px;
          font-weight: 600;
        }
        .footer {
          background-color: #f9fafb;
          text-align: center;
          padding: 16px;
          font-size: 14px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Course Purchase Successful 🎉</h1>
        </div>
        <div class="content">
          <h2>Hi ${username},</h2>
          <p>
            Congratulations! You’ve successfully purchased the course:
            <strong>${courseName}</strong>.
          </p>
          <p>
            We’re excited to have you start learning. You now have full access to the course materials, videos, and resources.
          </p>
          <a href="http://localhost:5173/courses" class="button">
            Go to My Courses
          </a>
          <p style="margin-top: 24px;">
            If you have any questions or face any issues accessing your course, don’t hesitate to contact our support team.
          </p>
          <p>
            Happy Learning!<br/>
            <strong>Future Minds Institute Team</strong>
          </p>
        </div>
        <div class="footer">
          © 2025 Future Minds Institute. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};
