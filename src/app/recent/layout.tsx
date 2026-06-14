import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Session History & Local File Cache | PDFlow',
  description: 'Access, download, and chain files processed during your active session. 100% private local caching. Zero file uploads.',
  alternates: {
    canonical: 'https://pdflow.in/recent',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
