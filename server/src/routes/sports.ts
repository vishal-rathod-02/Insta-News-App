import express from 'express';
import Parser from 'rss-parser';

const router = express.Router();
const parser = new Parser();

const fetchESPN = async (url: string, prefix: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await res.json();
    return data.events?.reverse().slice(0, 7).map((event: any, index: number) => {
      const comp = event.competitions[0];
      const home = comp.competitors.find((c: any) => c.homeAway === 'home');
      const away = comp.competitors.find((c: any) => c.homeAway === 'away');

      const isLive = event.status.type.state === 'in';
      const gameLink = event.links?.[0]?.href || '';

      return {
        id: `${prefix}-${index}`,
        team1: home?.team.displayName || home?.team.shortDisplayName || 'Home',
        team2: away?.team.displayName || away?.team.shortDisplayName || 'Away',
        score1: home?.score || '0',
        score2: away?.score || '0',
        status: event.status.type.shortDetail || 'Scheduled',
        isLive: isLive,
        time: event.status.type.shortDetail,
        link: gameLink
      };
    }) || [];
  } catch (error) {
    console.error(`ESPN fetch error for ${prefix}:`, error);
    return [];
  }
};

router.get('/live', async (req, res) => {
  try {
    const fetchWithTimeout = <T>(promise: Promise<T>, ms: number) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Timeout')), ms);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
    };

    const [cricketResult, footballResult] = await Promise.allSettled([
      fetchWithTimeout(parser.parseURL('https://static.cricinfo.com/rss/livescores.xml'), 5000),
      fetchESPN('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard', 'football')
    ]);

    let cricketMatches: any[] = [];
    if (cricketResult.status === 'fulfilled') {
      const feed = cricketResult.value;
      cricketMatches = feed.items.reverse().slice(0, 7).map((item, index) => {
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

        // Remove trailing asterisk from score if exists
        const isLive = team2ScoreRaw.includes('*') || team1ScoreRaw.includes('*');
        
        team2Score = team2Score.replace('*', '').trim();

        return {
          id: `cricket-${index}`,
          team1: team1Name || 'Team A',
          team2: team2Name || 'Team B',
          score1: team1Score || 'Yet to bat',
          score2: team2Score || 'Yet to bat',
          status: isLive ? 'In Progress' : 'Match Ended',
          isLive: isLive,
          time: isLive ? 'Live' : 'Done',
          link: item.link || ''
        };
      });
      cricketMatches.sort((a, b) => (b.isLive === a.isLive ? 0 : b.isLive ? 1 : -1));
    }
    const footballMatches = footballResult.status === 'fulfilled' ? footballResult.value : [];
    footballMatches.sort((a: any, b: any) => (b.isLive === a.isLive ? 0 : b.isLive ? 1 : -1));

    res.json({
      success: true,
      data: {
        cricket: cricketMatches.length > 0 ? cricketMatches : [
          { id: 1, team1: "India", team2: "Australia", score1: "214/4", score2: "189/8", status: "India won by 25 runs", isLive: false, time: "Final" }
        ],
        football: footballMatches.length > 0 ? footballMatches : [
          { id: 'f-mock1', team1: "Chelsea", team2: "Arsenal", score1: "0", score2: "0", status: "Scheduled", isLive: false, time: "Tomorrow" }
        ]
      }
    });

  } catch (error) {
    console.error("Sports feed error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sports scores" });
  }
});

export default router;
