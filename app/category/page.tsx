import type { Metadata } from "next";
import CategoryView from "@/components/CategoryView";

export const metadata: Metadata = {
  title: "카테고리 | 오늘의 문장",
};

export default function CategoryPage() {
  return <CategoryView />;
}
