import type { Metadata, Viewport } from "next";
import { Gaegu, Jua } from "next/font/google";
import { Suspense } from "react";
import HillBunny from "@/components/HillBunny";
import Logo from "@/components/Logo";
import NavTabs from "@/components/NavTabs";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import TodayDate, { TodayDateFallback } from "@/components/TodayDate";
import { themeInitScript } from "@/lib/theme";
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
  // 처음 값은 시스템 설정 기준. 사용자가 테마를 고르면 lib/theme.ts 의 applyTheme 이 고쳐 쓴다
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2430" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // <head> 스크립트가 하이드레이션 전에 class(.dark)와 color-scheme 을 바꾸므로 경고를 끈다
    <html lang="ko" className={`${jua.variable} ${gaegu.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-notebook min-h-screen pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        {/* 아래 여백 192px: 맨 아래까지 내려도 내용이 언덕 위 토끼(뛸 때 최대 약 188px)와 겹치지 않게 */}
        <div className="relative mx-auto max-w-[620px] px-[18px] pt-5 pb-48 note:pr-5 note:pl-14">
          {/* 아주 좁은 화면에서는 날짜가 로고 아래 줄로 내려간다 */}
          <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-2">
            <Logo />
            <div className="ml-auto flex items-center gap-2.5">
              <Suspense fallback={<TodayDateFallback />}>
                <TodayDate />
              </Suspense>
              <ThemeToggle />
            </div>
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
