import type { Metadata } from 'next';
import { Providers } from '@/app/providers';
import { AuthStatusBar } from '@/widgets/auth-status';
import '@/app/styles/globals.css';

export const metadata: Metadata = {
  title: '은하계 게시판',
  description: '3D 우주 공간에서 게시글을 탐색하는 게시판',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AuthStatusBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
