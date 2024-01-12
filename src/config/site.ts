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
  },
};

export type SiteConfig = typeof siteConfig;
