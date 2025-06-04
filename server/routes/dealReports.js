const express = require('express');
const router = express.Router();
const DealReport = require('../models/DealReport');
const auth = require('../middleware/auth');

// Submit a deal report
router.post('/:dealId', auth, async (req, res) => {
  try {
    const report = new DealReport({
      dealId: req.params.dealId,
      userId: req.user.id,
      type: req.body.type,
      comment: req.body.comment
    });
    await report.save();
    res.status(201).json({ message: 'Report submitted' });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ message: 'Error submitting report' });
  }
});

module.exports = router;
