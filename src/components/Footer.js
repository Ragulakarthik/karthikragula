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
    <footer className="mt-auto flex justify-center border-t-[3px] border-[var(--line)] py-4 text-sm font-medium text-[var(--muted)]">
      <div className="flex w-full max-w-3xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} Karthik Ragula. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-[var(--line)] text-[var(--ink)] transition hover:bg-[var(--accent)] hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
