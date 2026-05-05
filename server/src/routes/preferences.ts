import express from 'express';
import { UserPreference } from '../models/UserPreference.js';

const router = express.Router();

// Get user preferences
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let prefs = await UserPreference.findOne({ userId });
    
    if (!prefs) {
      prefs = await UserPreference.create({ userId, savedCategories: [] });
    }
    
    res.json({ success: true, data: prefs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update saved categories
router.post('/:userId/categories', async (req, res) => {
  try {
    const { userId } = req.params;
    const { categories } = req.body; // Array of category IDs like ['technology', 'sports']

    const prefs = await UserPreference.findOneAndUpdate(
      { userId },
      { $set: { savedCategories: categories } },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: prefs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
