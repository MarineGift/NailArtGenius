import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // 런타임에서 명확한 오류 노출
  // (빌드타임에 값이 없다면 Home에서 경고 박스가 먼저 보입니다.)
  // throw new Error('Missing Supabase public envs')
}

export const supabase = createClient(url ?? '', anonKey ?? '')
