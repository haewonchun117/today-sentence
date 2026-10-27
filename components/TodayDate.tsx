import { connection } from "next/server";

const CLASS = "font-hand text-[1.05rem] whitespace-nowrap text-ink-soft note:text-xl";

// 한국 시간 기준 오늘 날짜. 요청 시점에 계산하므로 <Suspense> 안에서 쓴다
export default async function TodayDate() {
  await connection();
  const text = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());

  return <span className={CLASS}>{text}</span>;
}

export function TodayDateFallback() {
  return (
    <span className={CLASS} aria-hidden="true">
      &nbsp;
    </span>
  );
}
