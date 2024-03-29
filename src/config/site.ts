import { API_BASE_URL, BASE_URL } from "./urls";

export const siteConfig = {
  name: "Virtual Pitwall",
  url: BASE_URL,
  ogImage: BASE_URL + "/logo.png",
  descriptionShort: "Realtime web-based iRacing dashboard",
  description: "Virtual Pitwall - Realtime web-based iRacing dashboard",
  links: {
    github: "https://github.com/kart7990/virtualpitwall",
    client: API_BASE_URL + "/app/setup.exe",
    discord: "https://discord.gg/GvyT36A4kM",
  },
};

export type SiteConfig = typeof siteConfig;

export const MOCKING: boolean = process.env.MOCKING === "true";
