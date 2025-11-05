import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    watchlist: { type: [String], default: [] },
    preferences: {
      lastSymbol: { type: String, default: 'AAPL' },
      timeRange: { type: String, default: '6mo' },
      indicators: {
        sma: { type: Boolean, default: false },
        ema: { type: Boolean, default: true },
        rsi: { type: Boolean, default: false },
        macd: { type: Boolean, default: false },
        bbands: { type: Boolean, default: false },
      },
      density: { type: String, enum: ['comfortable', 'compact'], default: 'comfortable' },
      panelOrder: { type: [String], default: ['watchlist', 'chart', 'prediction', 'news'] },
    },
    portfolio: [
      {
        symbol: { type: String, required: true },
        quantity: { type: Number, required: true },
        avgCost: { type: Number, required: true },
        currency: { type: String, default: 'USD' },
        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
