function Svg({ className = "h-5 w-5", children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V19a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 20v-5.5h5V20" />
    </Svg>
  );
}

export function CompaniesIcon(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path strokeWidth="2.6" d="M9 7h.01M9 11h.01M9 15h.01M15 7h.01M15 11h.01M15 15h.01" />
      <path d="M10 21v-4h4v4" />
    </Svg>
  );
}

export function DsaIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="5" r="2.1" />
      <circle cx="6" cy="14" r="2.1" />
      <circle cx="18" cy="14" r="2.1" />
      <path d="M10.4 6.6 7.6 12M13.6 6.6l2.8 5.4" />
      <path d="M6 16.1v2.9M18 16.1v2.9" />
    </Svg>
  );
}

export function ResumeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 3h6.5L18 7.5V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3v4.5H18" />
      <path d="M9 12h6M9 15.5h6M9 9h2.5" />
    </Svg>
  );
}

export function CareerTipsIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 20h16" />
      <path d="M7 20v-4M11.5 20v-8M16 20v-2" />
      <path d="M4 10l4.5-4 3.5 2.5L18 3" />
      <path d="M14.5 3H18v3.5" />
    </Svg>
  );
}

export function MiscellaneousIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

export function ExpandIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4" />
    </Svg>
  );
}

export function PlusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export const CATEGORY_ICONS = {
  companies: CompaniesIcon,
  dsa: DsaIcon,
  resume: ResumeIcon,
  "career-tips": CareerTipsIcon,
  miscellaneous: MiscellaneousIcon,
};
