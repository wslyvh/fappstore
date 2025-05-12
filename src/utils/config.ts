export const APP_EMOJI = "📱";
export const APP_NAME = "Farcaster App Store";
export const APP_DESCRIPTION = "Discover the best Apps on Farcaster";
export const APP_DOMAIN = "fappstore.com";
export const APP_URL = `https://${APP_DOMAIN}`;

export const SOCIAL_TWITTER = "wslyvh";
export const SOCIAL_FARCASTER = "wslyvh.eth";
export const SOCIAL_GITHUB = "wslyvh/fappstore";

export const FEATURED_APPS = [
  "hypersub.xyz",
  "memories.nexth.dev",
  "app.farcaster-rpgf.com",
  "farville.farm",
  "gigbot.xyz",
] as const;

export const POPULAR_TAGS = [
  { id: "social", name: "Social", color: "badge-primary" },
  { id: "games", name: "Games", color: "badge-secondary" },
  { id: "finance", name: "Finance", color: "badge-accent" },
  { id: "art-creativity", name: "Art & Creativity", color: "badge-info" },
  { id: "entertainment", name: "Entertainment", color: "badge-error" },
];

export const CATEGORIES = [
  {
    id: "games",
    name: "Games",
    description:
      "Games built for the Farcaster ecosystem, from casual mini-games to complex multiplayer experiences with on-chain achievements.",
    icon: "🎮",
  },
  {
    id: "social",
    name: "Social",
    description:
      "Apps that enhance your Farcaster experience with new ways to connect, share, and interact with each other, and the community.",
    icon: "👥",
  },
  {
    id: "finance",
    name: "Finance",
    description:
      "Tools for managing crypto assets, tracking investments, and participating in DeFi activities within the Farcaster ecosystem.",
    icon: "💰",
  },
  {
    id: "utility",
    name: "Utility",
    description:
      "Essential tools and services that enhance your Farcaster experience, from network explorers to data management utilities.",
    icon: "🔧",
  },
  {
    id: "productivity",
    name: "Productivity",
    description:
      "Apps to help you stay organized, manage tasks, and enhance your workflow while leveraging your Farcaster identity.",
    icon: "✅",
  },
  {
    id: "health-fitness",
    name: "Health & Fitness",
    description:
      "Track physical activity, monitor health metrics, and engage with wellness communities in the Farcaster ecosystem.",
    icon: "💪",
  },
  {
    id: "news-media",
    name: "News & Media",
    description:
      "Stay informed with curated content, journalism, and information services focused on crypto, Web3, and general interest topics.",
    icon: "📰",
  },
  {
    id: "music",
    name: "Music",
    description:
      "Discover, share, and experience music with apps that integrate streaming services and offer social music experiences.",
    icon: "🎵",
  },
  {
    id: "shopping",
    name: "Shopping",
    description:
      "Discover and purchase products, from physical goods to digital assets, with social commerce features and crypto payments.",
    icon: "🛍️",
  },
  {
    id: "education",
    name: "Education",
    description:
      "Learn and grow with educational content, courses, and knowledge-sharing communities focused on crypto and Web3 topics.",
    icon: "🎓",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description:
      "Resources, frameworks, and utilities for building and enhancing applications on the Farcaster protocol.",
    icon: "👨‍💻",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description:
      "Enjoy diverse experiences beyond gaming, including video content, interactive experiences, and creative entertainment.",
    icon: "🍿",
  },
  {
    id: "art-creativity",
    name: "Art & Creativity",
    description:
      "Create, share, and discover digital art and creative content, with tools for artistic expression and NFT creation.",
    icon: "🎨",
  },
] as const;
