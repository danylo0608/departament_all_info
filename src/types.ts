export interface MinistryLocation {
  id: string;
  name: string;
  type: 'youth' | 'social' | 'education' | 'children' | 'mercy';
  typeNameUk: string;
  description: string;
  address: string;
  coordinates: { x: number; y: number }; // Percentage position on the visual map
  responsiblePerson: string;
  email: string;
  phone: string;
  detailedMission?: string;
  meetingsSchedule?: { day: string; title: string; time: string }[];
  galleryImages?: string[];
  socials?: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    youtube?: string;
  };
}

export interface Minister {
  id: string;
  name: string;
  title: string;
  category: 'pastor' | 'youth' | 'mercy' | 'education' | 'music';
  categoryNameUk: string;
  bio: string;
  photoUrl: string;
  email?: string;
  phone?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    youtube?: string;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  imageUrl: string;
  content: string;
}

export interface ChurchEvent {
  id: string;
  day: string;
  month: string;
  title: string;
  location: string;
  description: string;
  date?: string; // YYYY-MM-DD
  category?: 'youth' | 'social' | 'education' | 'children' | 'mercy';
  categoryNameUk?: string;
  isArchived?: boolean; // For archive of ministries/events
}
