import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

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
    <html className='scroll-smooth' lang='en'>
      <head>
        {/* Place your script in the <head> */}
        <Script
          id='flodesk-script'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              (function(w, d, t, h, s, n) {
                w.FlodeskObject = n;
                var fn = function() {
                  (w[n].q = w[n].q || []).push(arguments);
                };
                w[n] = w[n] || fn;
                var f = d.getElementsByTagName(t)[0];
                var v = '?v=' + Math.floor(new Date().getTime() / (120 * 1000)) * 60;
                var sm = d.createElement(t);
                sm.async = true;
                sm.type = 'module';
                sm.src = h + s + '.mjs' + v;
                f.parentNode.insertBefore(sm, f);
                var sn = d.createElement(t);
                sn.async = true;
                sn.noModule = true;
                sn.src = h + s + '.js' + v;
                f.parentNode.insertBefore(sn, f);
              })(window, document, 'script', 'https://assets.flodesk.com', '/universal', 'fd');
            `,
          }}
        />
      </head>
      <body className={`${neueMontreal.variable} antialiased`}>
        {/* You can uncomment the navigation and footer if needed */}
        {/* <Nav /> */}
        <div>{children}</div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
