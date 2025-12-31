import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  classLevel: { type: String, default: 'JSS 1' },
  avatar: { type: String,  },
  term: { type: String, default: 'Term 1' },
  subject: { type: String, default: 'Mathematics' },
  assimilationLevel: { type: String, default: 'default' },
  voiceName: { type: String, default: 'Kore' },
  theme: { type: String, default: 'dark' },
  subscription: {
    tier: { type: String, default: 'scholar' },
    lessonsUsed: { type: Number, default: 0 },
    billingCycleStart: { type: Number, default: Date.now }
  },
  activityLog: [
    {
      date: { type: String, required: true },
      minutes: { type: Number, default: 0 },
      sessions: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
