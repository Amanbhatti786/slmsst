import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: {
    default: "Shah Latif Model Secondary School Thikratho | SEF Supported",
    template: "%s | Shah Latif Model Secondary School Thikratho",
  },
  description:
    "Official website of Shah Latif Model Secondary School Thikratho (School Code: 340102001), Taluka Pano Akil, District Sukkur, Sindh. Supported by Sindh Education Foundation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
