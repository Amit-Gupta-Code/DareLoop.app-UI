import {
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
} from "lucide-react";

type Platform =
  | "Twitter"
  | "Linkedin"
  | "Youtube"
  | "Instagram"
  | "Facebook";

export const getPlatformIcon = (platform?: Platform) => {
  const iconClass = "w-3 h-3";

  switch (platform) {
    case "Twitter":
      return <Twitter className={iconClass} />;
    case "Linkedin":
      return <Linkedin className={iconClass} />;
    case "Youtube":
      return <Youtube className={iconClass} />;
    case "Instagram":
      return <Instagram className={iconClass} />;
    case "Facebook":
      return <Facebook className={iconClass} />;
    default:
      return null;
  }
};

export type { Platform };