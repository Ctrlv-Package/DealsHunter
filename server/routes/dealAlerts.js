const express = require('express');
const router = express.Router();
const DealAlert = require('../models/DealAlert');
const auth = require('../middleware/auth');

// Get all deal alerts for the current user
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await DealAlert.find({ userId: req.user.id, isActive: true })
      .sort('-createdAt');
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching deal alerts:', error);
    res.status(500).json({ message: 'Error fetching deal alerts' });
  }
});

// Create a new deal alert
router.post('/', auth, async (req, res) => {
  try {
    const { title, keywords, forum, notificationMethods, frequency, rating } = req.body;

    // Validate required fields
    if (!keywords || !keywords.length) {
      return res.status(400).json({ message: 'Keywords are required' });
    }

    const alert = new DealAlert({
      userId: req.user.id,
      title,
      keywords,
      forum,
      notificationMethods,
      frequency,
      rating
    });

    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating deal alert:', error);
    res.status(500).json({ message: 'Error creating deal alert' });
  }
});

// Update a deal alert
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, keywords, forum, notificationMethods, frequency, rating, isActive } = req.body;
    const alert = await DealAlert.findOne({ _id: req.params.id, userId: req.user.id });

    if (!alert) {
      return res.status(404).json({ message: 'Deal alert not found' });
    }

    // Update fields if provided
    if (title !== undefined) alert.title = title;
    if (keywords) alert.keywords = keywords;
    if (forum) alert.forum = forum;
    if (notificationMethods) alert.notificationMethods = notificationMethods;
    if (frequency) alert.frequency = frequency;
    if (rating) alert.rating = rating;
    if (isActive !== undefined) alert.isActive = isActive;

    await alert.save();
    res.json(alert);
  } catch (error) {
    console.error('Error updating deal alert:', error);
    res.status(500).json({ message: 'Error updating deal alert' });
  }
});

// Delete a deal alert
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await DealAlert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!alert) {
      return res.status(404).json({ message: 'Deal alert not found' });
    }

    res.json({ message: 'Deal alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal alert:', error);
    res.status(500).json({ message: 'Error deleting deal alert' });
  }
});

// Get popular deal alerts (aggregated and anonymized)
router.get('/popular', async (req, res) => {
  try {
    const popularKeywords = await DealAlert.aggregate([
      { $unwind: '$keywords' },
      {
        $group: {
          _id: '$keywords',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(popularKeywords);
  } catch (error) {
    console.error('Error fetching popular alerts:', error);
    res.status(500).json({ message: 'Error fetching popular alerts' });
  }
});

module.exports = router;
