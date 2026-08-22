import express from 'express';
import Parser from 'rss-parser';
import { getCache, setCache } from '../config/redis.js';

const router = express.Router();
const parser = new Parser();

const SPORTS_CACHE_KEY = 'sports:live:v2';
const SPORTS_CACHE_TTL = 60; // 60 seconds TTL

//Fetch ESPN Football / Basketball Matches (Rich with Team Logos & Badges) // 

const fetchESPN = async (url: string, prefix: string, defaultLeague: string, leagueLogo?: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await res.json();
    
    return data.events?.reverse().slice(0, 10).map((event: any, index: number) => {
      const comp = event.competitions[0];
      const home = comp.competitors.find((c: any) => c.homeAway === 'home');
      const away = comp.competitors.find((c: any) => c.homeAway === 'away');

      const isLive = event.status?.type?.state === 'in';
      const gameLink = event.links?.[0]?.href || '';
      const leagueName = data.leagues?.[0]?.name || defaultLeague;

      return {
        id: `${prefix}-${index}`,
        team1: home?.team?.displayName || home?.team?.shortDisplayName || 'Home',
        team2: away?.team?.displayName || away?.team?.shortDisplayName || 'Away',
        logo1: home?.team?.logo || `https://a.espncdn.com/i/teamlogos/default-team-logo.png`,
        logo2: away?.team?.logo || `https://a.espncdn.com/i/teamlogos/default-team-logo.png`,
        score1: home?.score || '0',
        score2: away?.score || '0',
        status: event.status?.type?.shortDetail || 'Scheduled',
        isLive: isLive,
        time: event.status?.type?.shortDetail || (isLive ? 'LIVE' : 'Done'),
        league: leagueName,
        leagueLogo: leagueLogo || data.leagues?.[0]?.logos?.[0]?.href,
        link: gameLink
      };
    }) || [];
  } catch (error) {
    console.error(`ESPN fetch error for ${prefix}:`, error);
    return [];
  }
};

// ------------------------------------------------------------------
// Fetch SportScore API (If API key provided)
// ------------------------------------------------------------------
const fetchSportScoreAPI = async () => {
  const apiKey = process.env.SPORTSCORE_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("YOUR_")) {
    return null;
  }

  try {
    const res = await fetch('https://sportscore1.p.rapidapi.com/sports/1/events/live', {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'sportscore1.p.rapidapi.com'
      }
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn("SportScore API fetch failed, using fallbacks:", err);
    return null;
  }
};

router.get('/live', async (req, res) => {
  try {
    // 1. Check Redis Cache
    const cachedData = await getCache<any>(SPORTS_CACHE_KEY);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        cached: true
      });
    }

    const fetchWithTimeout = <T>(promise: Promise<T>, ms: number) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Timeout')), ms);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
    };

    // 2. Fetch Live Matches from Providers
    const [cricketResult, premierLeagueResult, nbaResult] = await Promise.allSettled([
      fetchWithTimeout(parser.parseURL('https://static.cricinfo.com/rss/livescores.xml'), 5000),
      fetchESPN(
        'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
        'football',
        'English Premier League',
        'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png'
      ),
      fetchESPN(
        'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
        'basketball',
        'NBA',
        'https://a.espncdn.com/i/leaguelogos/nba/500/nba.png'
      )
    ]);

    // Parse Cricket RSS
    let cricketMatches: any[] = [];
    if (cricketResult.status === 'fulfilled') {
      const feed = cricketResult.value;
      cricketMatches = feed.items.reverse().slice(0, 10).map((item, index) => {
        const parts = item.title?.split(' v ') || [];
        const team1Full = parts[0] || 'Team 1';
        const team2Full = parts[1] || 'Team 2';

        const team1NameMatch = team1Full.match(/^[a-zA-Z\s\-]+/);
        const team1Name = team1NameMatch ? team1NameMatch[0].trim() : team1Full;
        let team1ScoreRaw = team1Full.substring(team1NameMatch ? team1NameMatch[0].length : 0).trim();
        let team1Score = team1ScoreRaw.includes('&') ? team1ScoreRaw.split('&').pop()?.trim() || '' : team1ScoreRaw;

        const team2NameMatch = team2Full.match(/^[a-zA-Z\s\-]+/);
        const team2Name = team2NameMatch ? team2NameMatch[0].trim() : team2Full;
        let team2ScoreRaw = team2Full.substring(team2NameMatch ? team2NameMatch[0].length : 0).trim();
        let team2Score = team2ScoreRaw.includes('&') ? team2ScoreRaw.split('&').pop()?.trim() || '' : team2ScoreRaw;

        const isLive = team2ScoreRaw.includes('*') || team1ScoreRaw.includes('*');
        team2Score = team2Score.replace('*', '').trim();

        return {
          id: `cricket-${index}`,
          team1: team1Name || 'Team A',
          team2: team2Name || 'Team B',
          logo1: `https://flagsapi.com/IN/flat/64.png`,
          logo2: `https://flagsapi.com/AU/flat/64.png`,
          score1: team1Score || 'Yet to bat',
          score2: team2Score || 'Yet to bat',
          status: isLive ? 'In Progress' : 'Match Ended',
          isLive: isLive,
          time: isLive ? 'LIVE' : 'Done',
          league: 'International Cricket',
          link: item.link || ''
        };
      });
      cricketMatches.sort((a, b) => (b.isLive === a.isLive ? 0 : b.isLive ? 1 : -1));
    }

    const footballMatches = premierLeagueResult.status === 'fulfilled' ? premierLeagueResult.value : [];
    footballMatches.sort((a: any, b: any) => (b.isLive === a.isLive ? 0 : b.isLive ? 1 : -1));

    const basketballMatches = nbaResult.status === 'fulfilled' ? nbaResult.value : [];
    basketballMatches.sort((a: any, b: any) => (b.isLive === a.isLive ? 0 : b.isLive ? 1 : -1));

    const sportsData = {
      cricket: cricketMatches.length > 0 ? cricketMatches : [
        {
          id: 'c-default1',
          team1: "India",
          team2: "Australia",
          logo1: "https://a.espncdn.com/i/teamlogos/cricket/500/6.png",
          logo2: "https://a.espncdn.com/i/teamlogos/cricket/500/2.png",
          score1: "214/4 (20.0)",
          score2: "189/8 (20.0)",
          status: "India won by 25 runs",
          isLive: false,
          time: "Final",
          league: "T20 International"
        }
      ],
      football: footballMatches.length > 0 ? footballMatches : [
        {
          id: 'f-default1',
          team1: "Arsenal",
          team2: "Chelsea",
          logo1: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png",
          logo2: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png",
          score1: "2",
          score2: "1",
          status: "78' Second Half",
          isLive: true,
          time: "78'",
          league: "Premier League"
        }
      ],
      basketball: basketballMatches.length > 0 ? basketballMatches : [
        {
          id: 'b-default1',
          team1: "Lakers",
          team2: "Warriors",
          logo1: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png",
          logo2: "https://a.espncdn.com/i/teamlogos/nba/500/gs.png",
          score1: "112",
          score2: "108",
          status: "Q4 02:15",
          isLive: true,
          time: "Q4 02:15",
          league: "NBA"
        }
      ]
    };

    // Save to Redis Cache (60 seconds)
    await setCache(SPORTS_CACHE_KEY, sportsData, SPORTS_CACHE_TTL);

    res.json({
      success: true,
      data: sportsData,
      cached: false
    });

  } catch (error) {
    console.error("Sports feed error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sports scores" });
  }
});

export default router;
