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
  title: "PDFLOW — Fast AI-Powered PDF & Document Tools",
  description: "Merge, convert, compress, perform OCR, split, and edit PDFs in seconds. Highly secure, 100% private, client-side document processing ecosystem.",
  keywords: ["pdf tools", "pdf to word", "pdf compressor", "pdf ocr", "client side pdf processing", "pdflow"],
  openGraph: {
    title: "PDFLOW — Fast AI-Powered PDF & Document Tools",
    description: "Highly secure, 100% private, client-side document processing ecosystem.",
    type: "website",
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
