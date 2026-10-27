import { connection } from "next/server";
import { getSupabase } from "@/lib/supabase-server";
import { serverError } from "@/lib/api";
import type { Category } from "@/lib/types";

export async function GET() {
  await connection();

  try {
    const { data, error } = await getSupabase()
      .from("categories")
      .select("id, name, sort")
      .order("sort");
    if (error) throw error;

    return Response.json({ categories: data as Category[] });
  } catch (err) {
    return serverError(err);
  }
}
