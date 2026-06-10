import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import AnimatedBackground from "@/components/background/AnimatedBackground";
import Navbar from "@/components/ui/Navbar";
import ToastContainer from "@/components/ui/ToastContainer";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free PDF Tools Online – Merge, Compress, Convert PDF | PDFlow",
  description: "Free online PDF tools. Merge PDF, compress PDF, convert PDF to Word, Excel, JPG and more. 100% browser-based, private and completely free.",
  keywords: ["pdf tools", "free pdf tools", "pdf to word", "pdf compressor", "pdf ocr", "private pdf tools", "client side pdf processing", "pdflow"],
  alternates: {
    canonical: "https://pdflow.in",
  },
  openGraph: {
    title: "Free PDF Tools Online – Merge, Compress, Convert PDF | PDFlow",
    description: "Free online PDF tools. Merge PDF, compress PDF, convert PDF to Word, Excel, JPG and more. 100% browser-based, private and completely free.",
    url: "https://pdflow.in",
    siteName: "PDFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Tools Online – Merge, Compress, Convert PDF | PDFlow",
    description: "Free online PDF tools. Merge PDF, compress PDF, convert PDF to Word, Excel, JPG and more. 100% browser-based, private and completely free.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "PDFlow",
            "url": "https://pdflow.in"
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PDFlow",
            "url": "https://pdflow.in",
            "logo": "https://pdflow.in/icon.png"
          }) }}
        />
        <ThemeProvider>
          <AnimatedBackground />
          <Navbar />
          <main className="flex-grow flex flex-col relative z-10">
            {children}
          </main>
          <ToastContainer />
        </ThemeProvider>
        <Analytics />
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-P426MGQNH3"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-P426MGQNH3');
        `}
      </Script>
    </html>
  );
}
