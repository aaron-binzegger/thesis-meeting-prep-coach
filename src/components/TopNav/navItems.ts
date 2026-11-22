export interface NavItem {
  to: string;
  label: string;
}

/** Primary navigation (spec section 6). */
export const navItems: NavItem[] = [
  { to: '/journey', label: 'Journey' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/use-it', label: 'Use it in your own AI' },
];
