// lib/auth.ts
import { cookies, headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // 서버에서 쿠키/헤더 기반으로 세션을 유지하고 싶다면 @supabase/ssr 사용 고려
  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { 'X-Client-Info': 'nailartgenius/1.0' } },
    auth: { persistSession: false } // 서버에서 세션 직접 관리
  });
}

export async function getUser() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

// 로그인/로그아웃/콜백 라우트는 app/api/auth/* 로 별도 구현
