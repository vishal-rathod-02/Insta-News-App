import mongoose from 'mongoose';

const UserPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  savedCategories: {
    type: [String],
    default: []
  },
  bookmarkedArticles: [{
    title: String,
    url: String,
    urlToImage: String,
    publishedAt: Date,
    source: String
  }]
}, { timestamps: true });

export const UserPreference = mongoose.model('UserPreference', UserPreferenceSchema);
