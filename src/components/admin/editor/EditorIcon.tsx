const ICONS = {
  undo: "M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 010 11H11",
  redo: "M15 14l5-5-5-5M20 9H9.5a5.5 5.5 0 000 11H13",
  bold: "M7 5h6a3.5 3.5 0 010 7H7zM7 12h7a3.5 3.5 0 010 7H7z",
  italic: "M10 5h8M6 19h8M14 5l-4 14",
  underline: "M7 4v7a5 5 0 0010 0V4M5 20h14",
  strike: "M4 12h16M16.5 7.5C16 5.9 14.3 5 12 5 9.2 5 7.5 6.3 7.5 8.2c0 1.2.6 2.1 1.8 2.8M7.5 16c.5 1.8 2.3 3 4.7 3 2.9 0 4.8-1.4 4.8-3.5 0-.6-.1-1.1-.4-1.5",
  alignLeft: "M4 6h16M4 10h10M4 14h16M4 18h10",
  alignCenter: "M4 6h16M7 10h10M4 14h16M7 18h10",
  alignRight: "M4 6h16M10 10h10M4 14h16M10 18h10",
  alignJustify: "M4 6h16M4 10h16M4 14h16M4 18h16",
  bulletList: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  orderedList: "M10 6h10M10 12h10M10 18h10M4 5h1.5v4M4 9h3M4 14.5c0-.8.7-1.5 1.5-1.5S7 13.7 7 14.5c0 1.2-3 2-3 3.5h3",
  quote: "M7 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6",
  divider: "M3 12h18M7 7h10M7 17h10",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14",
  link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 9.5h.01",
  textColor: "M6 16L11.2 4h1.6L18 16M8.2 11.5h7.6",
  highlight: "M14.5 4.5l5 5-8 8H6.5v-5zM4 20h16",
  clear: "M6 5h12M12 5l-4 14M4 20L20 4",
  chevron: "M6 9l6 6 6-6",
} as const;

export type EditorIconName = keyof typeof ICONS;

export function EditorIcon({ name, size = 18 }: { name: EditorIconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={ICONS[name]} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
