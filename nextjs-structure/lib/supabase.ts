import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트 측 Supabase 클라이언트
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// 서버 측 Supabase 클라이언트 (관리자 권한)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// 타입 안전한 테이블 접근
export const tables = {
  customers: () => supabase.from('customers'),
  admins: () => supabase.from('admins'),
  bookings: () => supabase.from('bookings'),
  gallery: () => supabase.from('gallery'),
  services: () => supabase.from('services'),
} as const;

// 관리자용 테이블 접근
export const adminTables = {
  customers: () => supabaseAdmin.from('customers'),
  admins: () => supabaseAdmin.from('admins'),
  bookings: () => supabaseAdmin.from('bookings'),
  gallery: () => supabaseAdmin.from('gallery'),
} as const;

// 에러 핸들링 유틸리티
export function handleSupabaseError(error: any) {
  console.error('Supabase error:', error);
  
  if (error.code === 'PGRST116') {
    return 'The result contains 0 rows';
  }
  
  if (error.code === '23505') {
    return 'This record already exists';
  }
  
  if (error.code === '23503') {
    return 'Referenced record does not exist';
  }
  
  return error.message || 'An unexpected error occurred';
}

// 실시간 구독 설정
export function subscribeToTable(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) {
  return supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter,
      },
      callback
    )
    .subscribe();
}