"use client";

import { usePathname } from "next/navigation";
import {
  YouTubeIcon,
  LinkedInIcon,
  InstagramIcon,
  GitHubIcon,
  PortfolioIcon,
} from "@/components/SocialIcons";

const SOCIAL_LINKS = [
  { label: "YouTube", href: "https://www.youtube.com/@karthikragula6666", Icon: YouTubeIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/karthik-ragula-5a5b94220/",
    Icon: LinkedInIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/karthikragula6666/",
    Icon: InstagramIcon,
  },
  { label: "GitHub", href: "https://github.com/Ragulakarthik", Icon: GitHubIcon },
  {
    label: "Portfolio",
    href: "https://ragulakarthik.github.io/Ragulakarthik/",
    Icon: PortfolioIcon,
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <footer className="mt-auto border-t border-black/10 py-8 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
      <div className="flex w-full flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-10 2xl:px-16">
        <p>&copy; {new Date().getFullYear()} Karthik Ragula. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              aria-label={label}
              className="text-black/60 transition hover:text-red-600 dark:text-white/60"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
