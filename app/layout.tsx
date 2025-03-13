import type { Metadata } from "next";
import localFont from "next/font/local";
import Nav from "./components/layout/nav";
import Footer from "./components/layout/footer";
import { ViewTransitions } from "next-view-transitions";
import LenisProvider from "./utils/lenisProvider";
import { HeroUIProvider } from "@heroui/react";
import "./globals.css";

const neueMontreal = localFont({
  src: "./fonts/PPNeueMontreal-Book.otf",
  variable: "--font-neueMontreal",
  weight: "200 300 400 500 600",
});

export const metadata: Metadata = {
  title: "Los Angeles Luxury Real Estate Agent | Kemoni Williams",
  description:
    "Kemoni Williams is a luxury real estate agent, serving LA and OC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <LenisProvider>
        <html lang='en'>
          <body className={`${neueMontreal.variable} antialiased`}>
            <HeroUIProvider>
              <Nav />
              <div>{children}</div>
              <Footer />
            </HeroUIProvider>
          </body>
        </html>
      </LenisProvider>
    </ViewTransitions>
  );
}
