const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
let userBalance = 1000;
const generateProvablyFairRoll = (clientSeed, serverSeed) => {

  const combinedSeed = clientSeed + serverSeed;
  const hash = crypto.createHmac('sha256', serverSeed)
    .update(combinedSeed)
    .digest('hex');
    const num = parseInt(hash.substring(0, 8), 16);
  return Math.floor((num / (0xFFFFFFFF + 1)) * 6) + 1;
};
app.post('/verify-balance', (req, res) => {
    const { currentBalance } = req.body;
    if (!currentBalance || currentBalance !== userBalance) {
      res.json({ balance: userBalance });
    } else {
      res.json({ balance: currentBalance });
    }
  });
app.post('/roll-dice', (req, res) => {
  try {
    const { betAmount, multiplier = 1 } = req.body;


    if (!betAmount || betAmount <= 0 || betAmount > userBalance) {
      return res.status(400).json({ error: 'Invalid bet amount' });
    }


    if (multiplier < 1 || multiplier > 3) {
      return res.status(400).json({ error: 'Invalid multiplier' });
    }


    const clientSeed = crypto.randomBytes(16).toString('hex');
    const serverSeed = crypto.randomBytes(32).toString('hex');


    const roll = generateProvablyFairRoll(clientSeed, serverSeed);

    const isWin = roll >= 4;  
    let newBalance = userBalance;
    let potentialWinnings = 0;
    if (isWin) {

      potentialWinnings = betAmount * multiplier;
      newBalance += potentialWinnings;
    } else {

      const totalLoss = betAmount * multiplier;
      newBalance = Math.max(0, newBalance - totalLoss);
    }
    userBalance = newBalance;
    res.json({
      roll,
      isWin,
      newBalance,
      potentialWinnings,
      clientSeed,
      serverSeed
    });
  } catch (error) {
    console.error('Dice roll error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/reset-balance', (req, res) => {
    userBalance = 1000;
    res.json({ balance: userBalance });
  });
  

// server started
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  module.exports = app;