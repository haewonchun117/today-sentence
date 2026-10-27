import type { Metadata, Viewport } from "next";
import { Gaegu, Jua } from "next/font/google";
import { Suspense } from "react";
import HillBunny from "@/components/HillBunny";
import Logo from "@/components/Logo";
import NavTabs from "@/components/NavTabs";
import Toast from "@/components/Toast";
import TodayDate, { TodayDateFallback } from "@/components/TodayDate";
import "./globals.css";

const jua = Jua({
  variable: "--font-jua",
  weight: "400",
  subsets: ["latin"],
});

const gaegu = Gaegu({
  variable: "--font-gaegu",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "오늘의 문장",
  description: "매일 새로운 문장으로 위로와 응원을 건네는 작은 노트",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2430" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jua.variable} ${gaegu.variable} antialiased`}>
      <body className="bg-notebook min-h-screen pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="relative mx-auto max-w-[620px] px-[18px] pt-5 pb-40 note:pr-5 note:pl-14">
          {/* 아주 좁은 화면에서는 날짜가 로고 아래 줄로 내려간다 */}
          <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-2">
            <Logo />
            <Suspense fallback={<TodayDateFallback />}>
              <TodayDate />
            </Suspense>
          </header>
          <NavTabs />
          <main>{children}</main>
        </div>
        <HillBunny />
        <Toast />
      </body>
    </html>
  );
}
