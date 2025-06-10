import { CATEGORIES } from "./config";

export type Category = (typeof CATEGORIES)[number]["id"];
export const VALID_CATEGORIES = CATEGORIES.map((c) => c.id);

export interface Author {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  powerBadge: boolean;
  score: number;
  followerCount: number;
}

export interface App {
  version: string;
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  description: string;
  category?: Category;
  tags?: string[];
  homeUrl: string;
  iconUrl: string;
  imageUrl?: string;
  framesUrl?: string;
  screenshotUrls?: string[];
  backgroundColor?: string;
  author: Author;
  indexedAt: number;
  updatedAt: number;
}

export interface Catalog {
  lastUpdated: string;
  totalItems: number;
  apps: App[];
}
