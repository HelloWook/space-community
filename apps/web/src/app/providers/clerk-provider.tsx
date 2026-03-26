'use client';

import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs';
import { koKR } from '@clerk/localizations';

/** Clerk 인증 프로바이더 래퍼 */
export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderBase localization={koKR}>
      {children}
    </ClerkProviderBase>
  );
}
