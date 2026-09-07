import express from 'express';
import { requireAuth } from '@clerk/express';
import { UserPreference } from '../models/UserPreference.js';

const router = express.Router();

/**
 * GET /api/preferences/me
 * Securely fetch preferences for the currently authenticated user
 */
router.get('/me', requireAuth(), async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let prefs = await UserPreference.findOne({ userId });
    if (!prefs) {
      prefs = await UserPreference.create({ userId, savedCategories: [], bookmarkedArticles: [] });
    }

    return res.json({ success: true, data: prefs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/preferences/me/categories
 * Securely update selected categories for the currently authenticated user
 */
router.post('/me/categories', requireAuth(), async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ success: false, message: 'Categories must be an array' });
    }

    const prefs = await UserPreference.findOneAndUpdate(
      { userId },
      { $set: { savedCategories: categories } },
      { new: true, upsert: true }
    );

    return res.json({ success: true, data: prefs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/preferences/me/bookmarks
 * Retrieve all bookmarks for the authenticated user
 */
router.get('/me/bookmarks', requireAuth(), async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const prefs = await UserPreference.findOne({ userId });
    return res.json({ success: true, data: prefs?.bookmarkedArticles || [] });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/preferences/me/bookmarks
 * Add or update a bookmarked article
 */
router.post('/me/bookmarks', requireAuth(), async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { article } = req.body;
    if (!article || !article.title) {
      return res.status(400).json({ success: false, message: 'Invalid article payload' });
    }

    const prefs = await UserPreference.findOneAndUpdate(
      { userId },
      { 
        $pull: { bookmarkedArticles: { url: article.link || article.url } },
      },
      { new: true, upsert: true }
    );

    const updated = await UserPreference.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          bookmarkedArticles: { 
            $each: [{
              title: article.title,
              url: article.link || article.url,
              urlToImage: article.imageUrl || article.urlToImage,
              publishedAt: article.pubDate ? new Date(article.pubDate) : new Date(),
              source: article.source
            }],
            $position: 0
          } 
        } 
      },
      { new: true, upsert: true }
    );

    return res.json({ success: true, data: updated.bookmarkedArticles });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Backward compatibility: GET user preferences by userId param
 */
router.get('/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    let prefs = await UserPreference.findOne({ userId });

    if (!prefs) {
      prefs = await UserPreference.create({ userId, savedCategories: [] });
    }

    return res.json({ success: true, data: prefs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Backward compatibility: Update saved categories by userId param
 */
router.post('/:userId/categories', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const { categories } = req.body;

    const prefs = await UserPreference.findOneAndUpdate(
      { userId },
      { $set: { savedCategories: categories } },
      { new: true, upsert: true }
    );

    return res.json({ success: true, data: prefs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
