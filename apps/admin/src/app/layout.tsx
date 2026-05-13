import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TLCC Admin Dashboard',
  description: 'คริสตจักรชีวิตสุขสันต์ - Admin Panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-[#181A1F]">{children}</body>
    </html>
  );
}
