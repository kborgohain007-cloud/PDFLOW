import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Session History & Logs | PDFLOW',
  description: 'Access and chain files processed during your active session. 100% private local session log.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
