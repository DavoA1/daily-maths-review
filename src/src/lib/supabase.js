import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jrjuugkfeblkaysfolza.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_u7s72zKB01-F8jgiZRRWgQ_iekcWgcJ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
