import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-7xl p-4 md:p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
