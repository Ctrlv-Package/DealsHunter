const config = require('../config');

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deals Aggregator</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background: #f8f9fa;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 10px 0;
    }
    .footer {
      text-align: center;
      padding: 20px 0;
      font-size: 12px;
      color: #666;
    }
    .deal-card {
      border: 1px solid #ddd;
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
    }
    .price {
      color: #4CAF50;
      font-weight: bold;
      font-size: 1.2em;
    }
    .savings {
      color: #e53935;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Deals Aggregator</h1>
  </div>
  ${content}
  <div class="footer">
    <p>This email was sent by Deals Aggregator</p>
    <p>You received this email because you signed up for notifications at ${config.clientUrl}</p>
    <p><a href="${config.clientUrl}/settings/notifications">Manage email preferences</a> | <a href="${config.clientUrl}/unsubscribe">Unsubscribe</a></p>
  </div>
</body>
</html>
`;

const welcomeTemplate = (name) => baseTemplate(`
  <div style="text-align: center;">
    <h2>Welcome to Deals Aggregator, ${name}! 👋</h2>
    <p>We're excited to have you join our community of smart shoppers.</p>
    <p>Get ready to discover amazing deals across your favorite categories!</p>
    <div style="margin: 30px 0;">
      <h3>Quick Start Guide:</h3>
      <ol style="text-align: left;">
        <li>Set up your deal preferences</li>
        <li>Create price alerts for products</li>
        <li>Browse our latest deals</li>
      </ol>
    </div>
    <a href="${config.clientUrl}/deals" class="button">Start Exploring Deals</a>
  </div>
`);

const passwordResetTemplate = (resetLink) => baseTemplate(`
  <div style="text-align: center;">
    <h2>Reset Your Password</h2>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p style="margin-top: 20px; font-size: 0.9em;">
      If you didn't request this change, you can safely ignore this email.<br>
      This link will expire in 1 hour for security reasons.
    </p>
  </div>
`);

const dealAlertTemplate = (deals) => baseTemplate(`
  <div>
    <h2>New Deals Alert! 🔥</h2>
    <p>We found some great deals matching your preferences:</p>
    ${deals.map(deal => `
      <div class="deal-card">
        <h3>${deal.title}</h3>
        <p class="price">$${deal.price.toFixed(2)}</p>
        <p class="savings">Save ${deal.discount}%</p>
        <p>${deal.description}</p>
        <a href="${config.clientUrl}/deal/${deal.id}" class="button">View Deal</a>
      </div>
    `).join('')}
  </div>
`);

const weeklyNewsletterTemplate = (deals, topCategories) => baseTemplate(`
  <div>
    <h2>Your Weekly Deals Digest 📊</h2>
    
    <h3>Top Categories This Week</h3>
    <div style="margin-bottom: 20px;">
      ${topCategories.map(category => `
        <div style="margin: 10px 0;">
          <strong>${category.name}</strong>: ${category.dealCount} deals, avg. discount ${category.avgDiscount}%
        </div>
      `).join('')}
    </div>

    <h3>Featured Deals</h3>
    ${deals.map(deal => `
      <div class="deal-card">
        <h3>${deal.title}</h3>
        <p class="price">$${deal.price.toFixed(2)}</p>
        <p class="savings">Save ${deal.discount}%</p>
        <p>${deal.description}</p>
        <a href="${config.clientUrl}/deal/${deal.id}" class="button">View Deal</a>
      </div>
    `).join('')}
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${config.clientUrl}/deals" class="button">View All Deals</a>
    </div>
  </div>
`);

const verificationEmailTemplate = (verificationLink) => baseTemplate(`
  <div style="text-align: center;">
    <h2>Verify Your Email Address</h2>
    <p>Thanks for signing up! Please verify your email address to access all features:</p>
    <a href="${verificationLink}" class="button">Verify Email</a>
    <p style="margin-top: 20px; font-size: 0.9em;">
      If you didn't create an account with us, you can safely ignore this email.
    </p>
  </div>
`);

module.exports = {
  welcomeTemplate,
  passwordResetTemplate,
  dealAlertTemplate,
  weeklyNewsletterTemplate,
  verificationEmailTemplate
};
