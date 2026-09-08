
export interface NewsArticle {
  publishdate: number;
  isVideo: any;
  id: string;
  title: string;
  link: string;
  pubDate: string;
  creator: string | null;
  content: string;
  contentSnippet: string;
  isoDate: string;
  source: string;
  imageUrl?: string;
  category?: string;
}

export interface UseNewsOptions {
  keyword?: string;
  video?: boolean;
  trending?: boolean;
  page?: number;
}

export interface NewsSubCategory {
  id: string;
  title: string;
}

export interface NewsCategory {
  id: string;
  title: string;
  subcategories?: NewsSubCategory[];
}

export interface NewsCardProps {
  article: NewsArticle;
  onSummarize: (article: NewsArticle) => void;
  isFeatured?: boolean;
}

export interface SummarizeModalProps {
  article: NewsArticle;
  onClose: () => void;
}
export interface CarouselProps {
  country: string;
  onSummarize: (article: NewsArticle) => void;
}


export interface NavbarProps {
  theme: string;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  activeCategory: string;
}

export interface NewsSectionProps {
  title: string;
  categoryId: string;
  country: string
  onSummarize: (article: NewsArticle) => void;
}

 export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
}

