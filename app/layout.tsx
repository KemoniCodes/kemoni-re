import type { Metadata } from "next";
import localFont from "next/font/local";
import Nav from "./components/layout/nav";
import "./globals.css";

const neueMontreal = localFont({
  src: "./fonts/PPNeueMontreal-Book.otf",
  variable: "--font-neueMontreal",
  weight: "200 300 400 500 600",
});

export const metadata: Metadata = {
  title: "Los Angeles Luxury Real Estate Agent | Kemoni Williams",
  description:
    "Kemoni Williams is a luxury real estate agent that serves LA and OC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className='scroll-smooth' lang='en'>
      <body className={`${neueMontreal.variable} antialiased`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
