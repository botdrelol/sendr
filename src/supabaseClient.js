//Creates one const supabase client that can be imported and used in other files to interact with the Supabase database. It uses environment variables to store the Supabase URL and anonymous key for security reasons.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)