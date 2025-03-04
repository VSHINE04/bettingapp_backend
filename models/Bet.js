const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  betAmount: {
    type: Number,
    required: true
  },
  rollResult: {
    type: Number,
    required: true
  },
  isWin: {
    type: Boolean,
    required: true
  },
  serverSeed: {
    type: String,
    required: true
  },
  clientSeed: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bet', BetSchema);