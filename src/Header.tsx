import * as React from 'react';
import TopMenu from './TopMenu';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Mint', href: '/mint' },
  {
    label: 'Projects',
    children: [
      { label: 'Dragons', href: '/projects/dragons' },
      { label: 'Arena', href: '/projects/arena' },
    ],
  },
  { label: 'Docs', href: '/docs' },
];

export default function AppHeader() {
  // You can pass current path from your router if you want active highlighting
  return (
    <TopMenu
      brand="Epoch Games"
      links={links}
      currentPath={typeof window !== 'undefined' ? window.location.pathname : '/'}
      showWallet
      rightSlot={null} // or your own avatar/menu
    />
  );
}