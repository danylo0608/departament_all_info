import { MinistryLocation, Minister, NewsArticle, ChurchEvent } from './types';
import dataJson from './data.json';

export const INITIAL_LOCATIONS: MinistryLocation[] = dataJson.locations as MinistryLocation[];
export const INITIAL_MINISTERS: Minister[] = dataJson.ministers as Minister[];
export const INITIAL_NEWS: NewsArticle[] = dataJson.news as NewsArticle[];
export const INITIAL_EVENTS: ChurchEvent[] = dataJson.events as ChurchEvent[];
