const paths = {
  arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
  back: <path d="m14 6-6 6 6 6M8 12h12" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  home: <>
<path d="m3 10 9-7 9 7v10H3z" />
<path d="M9 20v-7h6v7" />
</>,
  squad: <>
<circle cx="9" cy="8" r="3" />
<path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5" />
</>,
  tactics: <>
<rect x="3" y="3" width="18" height="18" rx="3" />
<path d="M3 12h18M12 3v18" />
<circle cx="12" cy="12" r="4" />
</>,
  calendar: <>
<rect x="3" y="5" width="18" height="16" rx="3" />
<path d="M7 3v5M17 3v5M3 11h18M7 15h2M13 15h4M7 18h5" />
</>,
  search: <>
<circle cx="10" cy="10" r="6" />
<path d="m15 15 6 6" />
</>,
  settings: <>
<path d="M4 6h16M4 12h16M4 18h16" />
<circle cx="8" cy="6" r="2" />
<circle cx="16" cy="12" r="2" />
<circle cx="10" cy="18" r="2" />
</>,
  globe: <>
<circle cx="12" cy="12" r="9" />
<ellipse cx="12" cy="12" rx="4" ry="9" />
<path d="M3 12h18M5 6h14M5 18h14" />
</>,
  folder: <>
<path d="M3 7V5h6l2 3h10v12H3z" />
<path d="M3 8h8" />
</>,
  plus: <path d="M12 4v16M4 12h16" />,
  check: <path d="m5 12 4 4L20 5" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  mail: <>
<rect x="3" y="5" width="18" height="14" rx="2" />
<path d="m3 6 9 7 9-7" />
</>,
  training: <path d="M8 6v12M4 8v8M16 6v12M20 8v8M8 12h8" />,
  star: <path d="m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3-5.7-3-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z" />,
  shield: <>
<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" />
<path d="m8 12 3 3 5-6" />
</>,
  bolt: <path d="m14 2-9 12h6l-1 8 9-12h-6z" />,
  trophy: <path d="M7 3h10v5a5 5 0 0 1-10 0zM7 5H3v3a4 4 0 0 0 5 4M17 5h4v3a4 4 0 0 1-5 4M12 13v6M7 21h10M9 19h6" />,
  book: <path d="M4 3h14a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2zM4 17h16M8 7h8M8 11h5" />,
  pin: <>
<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
<circle cx="12" cy="10" r="2" />
</>,
  clock: <>
<circle cx="12" cy="12" r="9" />
<path d="M12 6v6l4 2" />
</>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  logout: <path d="M9 4H4v16h5M9 12h12m-5-5 5 5-5 5" />,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />,
  upload: <path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5" />,
  info: <>
<circle cx="12" cy="12" r="9" />
<path d="M12 11v6M12 7v1" />
</>,
  eye: <>
<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
<circle cx="12" cy="12" r="3" />
</>,
  flag: <path d="M5 21V3M5 3c5-4 9 4 15 0v10c-6 4-10-4-15 0" />,
  refresh: <path d="M20 8a9 9 0 1 0 1 7M20 3v6h-6" />,
  sun: <>
<circle cx="12" cy="12" r="4" />
<path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2" />
</>,
  moon: <path d="M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10Z" />
};
export function Icon({
  name = 'arrow',
  size = 20,
  className = '',
  ...props
}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} aria-hidden="true" {...props}>{paths[name] || paths.info}</svg>;
}
