import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarShell from "@/components/SidebarShell";
import { ProgressProvider } from "@/context/ProgressContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "Karthik Ragula",
  description:
    "All of Karthik Ragula's prep videos in one place — company interview experiences, DSA problems in Java, resume tips & career advice.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${grotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ProgressProvider>
          <SidebarShell>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </SidebarShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
