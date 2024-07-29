const mongoose = require('mongoose');

// Validate email format using a regular expression
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate non-empty name
const validateName = (name) => {
  return name && name.trim().length > 0;
};

// Validate mobile number format (Indian mobile number)
const validateMobileNumber = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

// Validate that percentages add up to 100
const validatePercentages = (participants) => {
  const totalPercentage = participants.reduce((sum, participant) => sum + participant.share, 0);
  return totalPercentage === 100;
};

// Validate that MongoDB ObjectIds are valid
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Middleware to validate user creation
const validateUser = (req, res, next) => {
  const { email, name, mobile } = req.body;
  
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!validateName(name)) {
    return res.status(400).json({ error: 'Name cannot be empty' });
  }

  if (!validateMobileNumber(mobile)) {
    return res.status(400).json({ error: 'Invalid mobile number format' });
  }

  next();
};

// Middleware to validate expense creation
const validateExpense = (req, res, next) => {
  const { amount, description, participants, splitType } = req.body;
  
  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero' });
  }

  if (!validateName(description)) {
    return res.status(400).json({ error: 'Description cannot be empty' });
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ error: 'Participants must be a non-empty array' });
  }

  for (const participant of participants) {
    if (!validateObjectId(participant.user)) {
      return res.status(400).json({ error: `Invalid participant user ID: ${participant.user}` });
    }
    if (participant.share <= 0) {
      return res.status(400).json({ error: 'Participant share must be greater than zero' });
    }
  }

  if (splitType === 'percentage' && !validatePercentages(participants)) {
    return res.status(400).json({ error: 'Percentages do not add up to 100' });
  }

  next();
};

module.exports = {
  validateUser,
  validateExpense,
};
