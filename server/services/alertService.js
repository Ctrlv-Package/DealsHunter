const DealAlert = require('../models/DealAlert');
const Deal = require('../models/Deal');
const nodemailer = require('nodemailer');

class AlertService {
  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Check new deals against all active alerts
  async processNewDeals(deals) {
    const activeAlerts = await DealAlert.find({ isActive: true });
    
    for (const deal of deals) {
      for (const alert of activeAlerts) {
        if (alert.matchesDeal(deal)) {
          await this.sendNotification(alert, deal);
          alert.matchCount += 1;
          alert.lastNotified = new Date();
          await alert.save();
        }
      }
    }
  }

  // Send notification based on user preferences
  async sendNotification(alert, deal) {
    for (const method of alert.notificationMethods) {
      switch (method) {
        case 'Email':
          await this.sendEmailNotification(alert, deal);
          break;
        case 'Mobile Push Notification':
          await this.sendPushNotification(alert, deal);
          break;
        default:
          console.warn(`Unsupported notification method: ${method}`);
      }
    }
  }

  // Send email notification
  async sendEmailNotification(alert, deal) {
    try {
      const emailContent = this.createEmailContent(alert, deal);
      
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Deals Hunter" <noreply@dealshunter.com>',
        to: alert.userId.email, // Assuming user email is populated
        subject: `New Deal Alert: ${deal.title}`,
        html: emailContent
      });

      console.log(`Email notification sent for alert ${alert._id}`);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  // Send push notification (placeholder for future implementation)
  async sendPushNotification(alert, deal) {
    // TODO: Implement push notification service
    console.log('Push notification service not implemented yet');
  }

  // Create HTML content for email notifications
  createEmailContent(alert, deal) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Deal Found!</h2>
        <p>We found a new deal matching your alert "${alert.title || 'Untitled Alert'}"</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${deal.title}</h3>
          <p>${deal.description}</p>
          <p><strong>Price:</strong> ${deal.price}</p>
          <p><strong>Rating:</strong> ${deal.rating}</p>
          <a href="${deal.url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Deal
          </a>
        </div>
        
        <p style="color: #666;">
          You received this email because you set up an alert for: ${alert.keywords.join(', ')}
        </p>
        <p style="color: #666; font-size: 12px;">
          To manage your alerts, log in to your Deals Hunter account.
        </p>
      </div>
    `;
  }

  // Clean up old alerts
  async cleanupOldAlerts(daysThreshold = 30) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - daysThreshold);

    await DealAlert.deleteMany({
      isActive: false,
      updatedAt: { $lt: threshold }
    });
  }
}

module.exports = new AlertService();
