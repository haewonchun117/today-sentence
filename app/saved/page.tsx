import type { Metadata } from "next";
import SavedView from "@/components/SavedView";

export const metadata: Metadata = {
  title: "저장한 문장 | 오늘의 문장",
};

export default function SavedPage() {
  return <SavedView />;
}
