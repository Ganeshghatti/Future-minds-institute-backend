// utils/emailTemplates/welcomeTemplate.js
export const welcomeTemplate = (username) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to Future Minds Institute</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background-color: #4f46e5; color: #fff; text-align: center; padding: 24px; }
        .content { padding: 30px; }
        .content h2 { color: #111827; }
        .button { background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; }
        .footer { background: #f9fafb; color: #6b7280; text-align: center; padding: 16px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Future Minds Institute 🎉</h1>
        </div>
        <div class="content">
          <h2>Hi ${username},</h2>
          <p>We're thrilled to have you on board! You’ve successfully logged in to your account.</p>
          <p>Explore our Website and start your journey with us.</p>
          <a href="http://localhost:5173" class="button">Go to Website</a>
          <p style="margin-top: 24px;">If you have any questions, feel free to reach out to our support team anytime.</p>
          <p>Best,<br/><strong>The Future Minds Institute Team</strong></p>
        </div>
        <div class="footer">
          © 2025 Future Minds Institute. All rights reserved.
        </div>
      </div>
    </body>
  </html>`;
};
