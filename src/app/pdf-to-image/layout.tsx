import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Image Online — Free & Private | PDFlow',
  description: 'Convert PDF pages to JPG, PNG, or WebP images. Free browser-based extraction. Files never leave your device. High resolution exports.',
  alternates: {
    canonical: 'https://pdflow.in/pdf-to-image',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
