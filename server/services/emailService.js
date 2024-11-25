const nodemailer = require('nodemailer');
const templates = require('./emailTemplates');
const config = require('../config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Deals Aggregator" <${config.email.user}>`,
        to,
        subject,
        html
      });
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const html = templates.welcomeTemplate(user.name || 'there');
    return this.sendEmail(
      user.email,
      'Welcome to Deals Aggregator!',
      html
    );
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetLink = `${config.clientUrl}/reset-password/${resetToken}`;
    const html = templates.passwordResetTemplate(resetLink);
    return this.sendEmail(
      user.email,
      'Reset Your Password',
      html
    );
  }

  async sendDealAlert(user, deals) {
    const html = templates.dealAlertTemplate(deals);
    return this.sendEmail(
      user.email,
      'New Deals Alert! 🔥',
      html
    );
  }

  async sendWeeklyNewsletter(user, deals, topCategories) {
    const html = templates.weeklyNewsletterTemplate(deals, topCategories);
    return this.sendEmail(
      user.email,
      'Your Weekly Deals Digest 📊',
      html
    );
  }

  async sendPriceDropAlert(user, product, newPrice, oldPrice) {
    const savings = ((oldPrice - newPrice) / oldPrice * 100).toFixed(1);
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Price Drop Alert! 📉</h2>
        <p>Good news! The price for ${product.name} has dropped.</p>
        <p>New Price: $${newPrice}</p>
        <p>Old Price: $${oldPrice}</p>
        <p>You save: ${savings}%</p>
        <a href="${product.url}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Deal
        </a>
      </div>
    `;
    return this.sendEmail(
      user.email,
      `Price Drop Alert: ${product.name}`,
      html
    );
  }

  // Batch send emails (for newsletters and alerts)
  async batchSendEmails(emailJobs) {
    const results = await Promise.allSettled(
      emailJobs.map(job => this.sendEmail(job.to, job.subject, job.html))
    );

    return results.map((result, index) => ({
      email: emailJobs[index].to,
      status: result.status,
      error: result.status === 'rejected' ? result.reason : null
    }));
  }
}

module.exports = new EmailService();
