import type { Metadata } from "next";
import { Inter, Be_Vietnam_Pro } from "next/font/google";
// @ts-ignore: CSS import declaration missing for globals.css
import "./globals.css";
import Provider from "./provider";
// @ts-ignore: CSS module declaration missing for leaflet package
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import LeafletSetup from "@/lib/leaflet";

const be_vietnam_pro = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KhauSpot",
    template: "%s | KhauSpot",
  },
  description:
    "Community-powered street-food discovery app to find nearby stalls, check in, and explore local food spots.",
  applicationName: "KhauSpot",
  keywords: [
    "KhauSpot",
    "street food",
    "food stalls",
    "map",
    "local discovery",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "KhauSpot",
    description:
      "Community-powered street-food discovery app to find nearby stalls, check in, and explore local food spots.",
    siteName: "KhauSpot",
  },
  twitter: {
    card: "summary",
    title: "KhauSpot",
    description:
      "Community-powered street-food discovery app to find nearby stalls, check in, and explore local food spots.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", be_vietnam_pro.className)}>
      <body className={` antialiased`}>
        <ClerkProvider>
          <Provider>
            {children}
            <LeafletSetup />
          </Provider>
          <Toaster richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
