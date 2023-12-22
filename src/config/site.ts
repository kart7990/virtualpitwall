import { BASE_URL } from "./urls"


export const siteConfig = {
  name: "Vitrual Pit Wall",
  url: BASE_URL,
  ogImage: BASE_URL + "/logo.png",
  description:
    "Virtual Pitbox - Realtime web-based race dashboard for iRacing",
  links: {
    github: "https://github.com/kart7990/virtualpitwall",
  },
}

export type SiteConfig = typeof siteConfig
