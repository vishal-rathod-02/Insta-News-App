import express from 'express';
import { UserPreference } from '../models/UserPreference.js';

const router = express.Router();

/**
 * Helper to extract userId from either Clerk session token, headers, query, or body
 */
const getRequestUserId = (req: express.Request): string | null => {
  const clerkUserId = (req as any).auth?.userId;
  if (clerkUserId) return clerkUserId;

  const headerUserId = req.headers['x-user-id'] as string;
  if (headerUserId) return headerUserId;

  const queryUserId = req.query.userId as string;
  if (queryUserId) return queryUserId;

  const bodyUserId = (req.body && req.body.userId) as string;
  if (bodyUserId) return bodyUserId;

  return null;
};

/**
 * GET /api/preferences/me
 * Fetch preferences for the authenticated user
 */
router.get('/me', async (req: express.Request, res: express.Response) => {
  try {
    const userId = getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not identified' });
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
 * Update selected categories for the authenticated user
 */
router.post('/me/categories', async (req: express.Request, res: express.Response) => {
  try {
    const userId = getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not identified' });
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
router.get('/me/bookmarks', async (req: express.Request, res: express.Response) => {
  try {
    const userId = getRequestUserId(req);
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
router.post('/me/bookmarks', async (req: express.Request, res: express.Response) => {
  try {
    const userId = getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { article } = req.body;
    if (!article || !article.title) {
      return res.status(400).json({ success: false, message: 'Invalid article payload' });
    }

    await UserPreference.findOneAndUpdate(
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

    return res.json({ success: true, data: updated?.bookmarkedArticles || [] });
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
