const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user profile
router.put('/profile', 
  auth,
  [
    body('name').optional().trim().isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('bio').optional().trim().isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('preferences.emailNotifications').optional().isObject(),
    body('preferences.dealCategories').optional().isArray(),
    body('preferences.priceAlerts').optional().isArray(),
    body('preferences.displayCurrency').optional().isIn(['USD', 'EUR', 'GBP']),
    body('preferences.theme').optional().isIn(['light', 'dark', 'system']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Update fields
      if (req.body.name) user.name = req.body.name;
      if (req.body.bio) user.bio = req.body.bio;
      if (req.body.preferences) {
        user.preferences = {
          ...user.preferences,
          ...req.body.preferences
        };
      }

      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Update notification settings
router.put('/notifications',
  auth,
  [
    body('emailNotifications').isObject(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      user.preferences.emailNotifications = {
        ...user.preferences.emailNotifications,
        ...req.body.emailNotifications
      };

      await user.save();
      res.json(user.preferences.emailNotifications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Add price alert
router.post('/price-alerts',
  auth,
  [
    body('productName').trim().notEmpty()
      .withMessage('Product name is required'),
    body('targetPrice').isNumeric()
      .withMessage('Target price must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      user.preferences.priceAlerts.push({
        productName: req.body.productName,
        targetPrice: req.body.targetPrice,
        active: true
      });

      await user.save();
      res.json(user.preferences.priceAlerts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Delete price alert
router.delete('/price-alerts/:alertId',
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const alertIndex = user.preferences.priceAlerts
        .findIndex(alert => alert._id.toString() === req.params.alertId);

      if (alertIndex === -1) {
        return res.status(404).json({ msg: 'Alert not found' });
      }

      user.preferences.priceAlerts.splice(alertIndex, 1);
      await user.save();
      
      res.json(user.preferences.priceAlerts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
