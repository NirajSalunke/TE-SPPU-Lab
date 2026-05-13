const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// DELETE /api/registrations/:regId — Delete a registration (admin)
router.delete('/registrations/:regId', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.regId);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });

    // Decrement event registration count
    await Event.findByIdAndUpdate(registration.event, { $inc: { registrationCount: -1 } });

    await Registration.findByIdAndDelete(req.params.regId);

    res.json({ message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete registration', message: err.message });
  }
});

module.exports = router;
