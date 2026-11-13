export function OverviewScene() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 480 270"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="overview-surface" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--card)" />
          <stop offset="1" stopColor="var(--surface-elevated)" />
        </linearGradient>
        <linearGradient id="overview-steel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--secondary)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <linearGradient id="overview-blue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--secondary)" />
        </linearGradient>
        <pattern height="24" id="overview-grid" patternUnits="userSpaceOnUse" width="24">
          <path d="M24 0H0V24" fill="none" stroke="var(--border)" strokeOpacity=".5" />
        </pattern>
      </defs>
      <rect fill="url(#overview-surface)" height="270" width="480" />
      <rect fill="url(#overview-grid)" height="270" width="480" />
      <path d="M0 218 166 52M286 270 480 76" stroke="var(--muted-strong)" strokeOpacity=".2" />
      <ellipse cx="240" cy="222" fill="var(--primary)" opacity=".12" rx="147" ry="18" />

      <g transform="translate(102 46)">
        <rect fill="var(--border)" height="145" rx="24" width="178" x="0" y="8" />
        <rect fill="var(--card)" height="143" rx="22" stroke="var(--muted-strong)" strokeWidth="2" width="178" />
        <circle cx="89" cy="77" fill="var(--surface)" r="53" stroke="var(--border)" strokeWidth="2" />
        <path d="M52 91a39 39 0 0 1 74-24" fill="none" stroke="url(#overview-steel)" strokeLinecap="round" strokeWidth="9" />
        <path d="m86 77 28-22" stroke="var(--primary)" strokeLinecap="round" strokeWidth="5" />
        <circle cx="86" cy="77" fill="var(--text)" r="7" />
        <path d="M39 124h100" stroke="var(--border)" strokeLinecap="round" strokeWidth="4" />
        <circle cx="51" cy="124" fill="var(--accent)" r="4" />
        <circle cx="127" cy="124" fill="var(--secondary)" r="4" />
      </g>

      <g transform="translate(297 77)">
        <path d="m0 26 47-26 47 26-47 27z" fill="var(--muted-strong)" />
        <path d="m0 26 47 27v71L0 97z" fill="url(#overview-steel)" />
        <path d="m94 26-47 27v71l47-27z" fill="url(#overview-blue)" />
        <path d="m21 39 25 14v42L21 81z" fill="var(--text)" opacity=".24" />
        <path d="m69 58 13-8v37l-13 8z" fill="var(--text)" opacity=".28" />
      </g>

      <g fill="var(--accent)">
        <circle cx="91" cy="88" r="3" />
        <circle cx="388" cy="55" r="4" />
        <circle cx="355" cy="207" r="3" />
      </g>
      <path d="M87 88h-23m324-33h22m-55 152h26" stroke="var(--muted-strong)" strokeDasharray="3 5" strokeOpacity=".55" />
    </svg>
  );
}
