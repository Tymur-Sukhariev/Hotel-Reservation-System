import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Header from "~/components/Header";
import { Irish_Grover } from 'next/font/google';
import { Inter } from 'next/font/google';
import Footer from "~/components/Footer";
import MyQueryClientProvider from "../components/MyQueryClientProvider";
import { Toaster } from 'react-hot-toast'
import ChatShell from "~/components/ChatShell";

const irishGrover = Irish_Grover({
  weight: '400',
  subsets: ['latin'],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "HOTEL",
  description: "Created by Tymur Sukhariev",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} ${irishGrover.className} ${GeistSans.variable}`}>
      <body>
        <MyQueryClientProvider>
          <Header />
          <Toaster position="top-center" />
          {children}
          <ChatShell />
          <Footer />
        </MyQueryClientProvider>
      </body>
    </html>
  );
}
