'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on workspace pages
  if (pathname?.startsWith('/workspace')) {
    return null;
  }
  
  return <Navbar />;
}