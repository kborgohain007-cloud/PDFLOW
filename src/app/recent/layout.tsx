import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Session History & Logs | PDFlow',
  description: 'Access and chain files processed during your active session. 100% private local session log.',
  alternates: {
    canonical: 'https://pdflow.in/recent',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
