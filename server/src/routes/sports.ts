import express from 'express';
import Parser from 'rss-parser';
import { getCache, setCache } from '../config/redis.js';

const router = express.Router();
const parser = new Parser();

const SPORTS_CACHE_KEY = 'sports:live:v4';
const SPORTS_CACHE_TTL = 45; // 45 seconds TTL

// Comprehensive Country & Cricket Team Mapping using Strict Regex Word Boundaries
const CRICKET_TEAMS_MAP: { patterns: RegExp[]; code?: string; logo?: string; league?: string }[] = [
  // International Nations
  { patterns: [/\b(india|ind|bharat)\b/i], code: "IN" },
  { patterns: [/\b(australia|aus|aussie)\b/i], code: "AU" },
  { patterns: [/\b(england|eng)\b/i], code: "GB" },
  { patterns: [/\b(south africa|rsa|proteas)\b/i], code: "ZA" },
  { patterns: [/\b(new zealand|nz|blackcaps)\b/i], code: "NZ" },
  { patterns: [/\b(pakistan|pak)\b/i], code: "PK" },
  { patterns: [/\b(sri lanka|sl|lanka)\b/i], code: "LK" },
  { patterns: [/\b(west indies|windies|caribbean|guyana|antigua|barbados|jamaica|trinbago|saint lucia|st kitts|nevis)\b/i], code: "JM" },
  { patterns: [/\b(bangladesh|ban|tigers)\b/i], code: "BD" },
  { patterns: [/\b(afghanistan|afg)\b/i], code: "AF" },
  { patterns: [/\b(ireland|ire)\b/i], code: "IE" },
  { patterns: [/\b(zimbabwe|zim)\b/i], code: "ZW" },
  { patterns: [/\b(netherlands|ned|dutch)\b/i], code: "NL" },
  { patterns: [/\b(scotland|sco)\b/i], code: "GB" },
  { patterns: [/\b(united arab emirates|uae|emirates)\b/i], code: "AE" },
  { patterns: [/\b(nepal|nep)\b/i], code: "NP" },
  { patterns: [/\b(united states|usa|america)\b/i], code: "US" },
  { patterns: [/\b(canada|can)\b/i], code: "CA" },
  { patterns: [/\b(oman|oma)\b/i], code: "OM" },
  { patterns: [/\b(namibia|nam)\b/i], code: "NA" },
  { patterns: [/\b(papua new guinea|png)\b/i], code: "PG" },
  { patterns: [/\b(kenya)\b/i], code: "KE" },
  { patterns: [/\b(uganda)\b/i], code: "UG" },
  { patterns: [/\b(hong kong)\b/i], code: "HK" },
  { patterns: [/\b(singapore)\b/i], code: "SG" },
  { patterns: [/\b(thailand)\b/i], code: "TH" },
  { patterns: [/\b(kuwait)\b/i], code: "KW" },
  { patterns: [/\b(qatar)\b/i], code: "QA" },
  { patterns: [/\b(italy)\b/i], code: "IT" },
  { patterns: [/\b(jersey)\b/i], code: "JE" },
  { patterns: [/\b(bahrain)\b/i], code: "BH" },
  { patterns: [/\b(saudi arabia)\b/i], code: "SA" },
  
  // English County Teams (UK Flag)
  { patterns: [/\b(leicestershire|somerset|surrey|yorkshire|lancashire|warwickshire|essex|hampshire|middlesex|nottinghamshire|sussex|kent|glamorgan|gloucestershire|northamptonshire|derbyshire|durham|worcestershire)\b/i], code: "GB", league: "County Championship" },

  // Indian Domestic & Zonal Teams (Duleep Trophy, Ranji Trophy, Deodhar, etc.)
  { patterns: [/\b(east zone|west zone|north zone|south zone|central zone|north east zone|mumbai|delhi|karnataka|tamil nadu|bengal|saurashtra|vidarbha|baroda|hyderabad|andhra|punjab|haryana|uttar pradesh|rajasthan|madhya pradesh|kerala|gujarat|jharkhand|assam|odisha|services|railways)\b/i], code: "IN", league: "Indian Domestic" },

  // Australian Domestic (Shield / Marsh Cup / BBL)
  { patterns: [/\b(new south wales|nsw|victoria|vic|queensland|qld|western australia|wa|south australia|sa|tasmania|tas|sixers|scorchers|stars|renegades|strikers|thunder|heat|hurricanes)\b/i], code: "AU", league: "Australian Cricket" },

  // IPL
  { patterns: [/\b(chennai super kings|csk|mumbai indians|mi|royal challengers|bengaluru|rcb|kolkata knight riders|kkr|rajasthan royals|rr|sunrisers|srh|delhi capitals|dc|punjab kings|pbks|gujarat titans|gt|lucknow super giants|lsg)\b/i], code: "IN", league: "IPL" },
];

/**
 * Returns accurate country flag URL using strict regex word boundaries
 */
const getCricketTeamLogo = (teamName: string): { logo?: string; league?: string } => {
  if (!teamName) return {};
  const normalized = teamName.trim();

  for (const entry of CRICKET_TEAMS_MAP) {
    for (const pattern of entry.patterns) {
      if (pattern.test(normalized)) {
        const logo = entry.logo || (entry.code ? `https://flagsapi.com/${entry.code}/flat/64.png` : undefined);
        return { logo, league: entry.league };
      }
    }
  }

  return {};
};

// Fetch ESPN Football Matches
const fetchESPNFootball = async (url: string, prefix: string, defaultLeague: string, leagueLogo?: string) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await res.json();
    
    return data.events?.map((event: any, index: number) => {
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
    }).filter((m: any) => m.isLive) || []; // Strictly keep only LIVE in-progress matches
  } catch (error) {
    console.error(`ESPN fetch error for ${prefix}:`, error);
    return [];
  }
};

// Fetch ESPN Tennis Matches (ATP & Grand Slams)
const fetchESPNTennis = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = await res.json();

    const matches: any[] = [];
    (data.events || []).forEach((event: any) => {
      const tournamentName = event.name || 'ATP Tour';
      (event.groupings || []).forEach((grouping: any) => {
        (grouping.competitions || []).forEach((comp: any, idx: number) => {
          if (comp.competitors && comp.competitors.length >= 2) {
            const p1 = comp.competitors[0];
            const p2 = comp.competitors[1];

            const score1 = (p1.linescores || []).map((l: any) => l.value).join(' ');
            const score2 = (p2.linescores || []).map((l: any) => l.value).join(' ');
            const isLive = comp.status?.type?.state === 'in';

            if (isLive) {
              matches.push({
                id: `tennis-${idx}`,
                team1: p1.athlete?.displayName || p1.athlete?.shortName || 'Player 1',
                team2: p2.athlete?.displayName || p2.athlete?.shortName || 'Player 2',
                logo1: p1.athlete?.flag?.href || undefined,
                logo2: p2.athlete?.flag?.href || undefined,
                score1: score1 || '-',
                score2: score2 || '-',
                status: comp.status?.type?.shortDetail || 'In Progress',
                isLive: true,
                time: 'LIVE',
                league: tournamentName,
                link: comp.links?.[0]?.href || event.links?.[0]?.href || ''
              });
            }
          }
        });
      });
    });

    return matches.slice(0, 10);
  } catch (error) {
    console.error("ESPN Tennis fetch error:", error);
    return [];
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

    // 2. Fetch Live Matches from Providers (Cricket, Premier League Football, ATP Tennis)
    const [cricketResult, premierLeagueResult, tennisResult] = await Promise.allSettled([
      fetchWithTimeout(parser.parseURL('https://static.cricinfo.com/rss/livescores.xml'), 5000),
      fetchESPNFootball(
        'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
        'football',
        'English Premier League',
        'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png'
      ),
      fetchESPNTennis()
    ]);

    // Parse Cricket RSS - Filter ONLY Active Live Matches
    let cricketMatches: any[] = [];
    if (cricketResult.status === 'fulfilled') {
      const feed = cricketResult.value;
      const rawMatches = feed.items.map((item, index) => {
        const rawTitle = item.title || '';
        const lowerTitle = rawTitle.toLowerCase();

        // If the title contains finished status ("won by", "drawn", "abandoned", "no result"), it is NOT live
        const isFinished =
          lowerTitle.includes('won by') ||
          lowerTitle.includes('match drawn') ||
          lowerTitle.includes('match tied') ||
          lowerTitle.includes('abandoned') ||
          lowerTitle.includes('no result');

        const parts = rawTitle.split(' v ');
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

        // An active cricket match has an asterisk (*) on one of the teams indicating active batting,
        // and is not marked as finished
        const hasAsterisk = team2ScoreRaw.includes('*') || team1ScoreRaw.includes('*') || rawTitle.includes('*');
        const isLive = !isFinished && (hasAsterisk || (!team1Score && !team2Score));

        team1Score = team1Score.replace('*', '').trim();
        team2Score = team2Score.replace('*', '').trim();

        // Resolve accurate team flags and league
        const meta1 = getCricketTeamLogo(team1Name);
        const meta2 = getCricketTeamLogo(team2Name);

        const leagueName = meta1.league || meta2.league || 'International Cricket';

        return {
          id: `cricket-${index}`,
          team1: team1Name || 'Team A',
          team2: team2Name || 'Team B',
          logo1: meta1.logo,
          logo2: meta2.logo,
          score1: team1Score ? (team1ScoreRaw.includes('*') ? `${team1Score} *` : team1Score) : 'Yet to bat',
          score2: team2Score ? (team2ScoreRaw.includes('*') ? `${team2Score} *` : team2Score) : 'Yet to bat',
          status: isLive ? 'In Progress' : 'Match Ended',
          isLive: isLive,
          time: isLive ? 'LIVE' : 'Done',
          league: leagueName,
          link: item.link?.trim() || ''
        };
      });

      // Strictly KEEP ONLY LIVE MATCHES
      cricketMatches = rawMatches.filter((m: any) => m.isLive);
    }

    const footballMatches = premierLeagueResult.status === 'fulfilled' ? premierLeagueResult.value : [];
    const tennisMatches = tennisResult.status === 'fulfilled' ? tennisResult.value : [];

    const sportsData = {
      cricket: cricketMatches,
      football: footballMatches,
      tennis: tennisMatches
    };

    // Save to Redis Cache (45 seconds)
    await setCache(SPORTS_CACHE_KEY, sportsData, SPORTS_CACHE_TTL);

    return res.json({
      success: true,
      data: sportsData,
      cached: false
    });

  } catch (error) {
    console.error("Sports feed error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch sports scores" });
  }
});

export default router;

