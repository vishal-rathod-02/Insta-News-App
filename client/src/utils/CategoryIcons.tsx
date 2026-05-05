import React from 'react';
import { 
  TrendingUp, Briefcase, Zap, Globe, Landmark, Film, Medal, HeartPulse 
} from 'lucide-react';

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  top: <TrendingUp className="w-5 h-5" />,
  business: <Briefcase className="w-5 h-5" />,
  technology: <Zap className="w-5 h-5" />,
  world: <Globe className="w-5 h-5" />,
  politics: <Landmark className="w-5 h-5" />,
  entertainment: <Film className="w-5 h-5" />,
  sports: <Medal className="w-5 h-5" />,
  health: <HeartPulse className="w-5 h-5" />,
};
