import "./globals.css";
import type { Metadata } from "next";
import {Inter} from "next/font/google";
import { Header } from "@/components/header";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
  });

export const metadata: Metadata = {
  title: "Overwatch",
  description:
    "Descubra personagens, funções, histórias e habilidades do universo de Overwatch.",
    icons: {
      icon: "/overwatch--v1.ico"
    }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${inter.variable}`}
    >
      <body suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  );
}
