import { createClient } from '@supabase/supabase-js'

/**
 * Supabase URL
 * 
 * This constant stores the URL of your Supabase project.
 * It's retrieved from an environment variable, which is a secure way to store
 * configuration that may change between environments.
 * 
 * The '!' at the end is a non-null assertion operator, telling TypeScript
 * that we're certain this environment variable will be defined.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

/**
 * Supabase Anon Key
 * 
 * This constant stores the anonymous key for your Supabase project.
 * This key is safe to use in browser environments as it has limited permissions.
 * 
 * Like the URL, it's retrieved from an environment variable.
 * The '!' is again used as a non-null assertion.
 */
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase Client
 * 
 * This creates a new Supabase client instance using the URL and anon key.
 * This client can be used to interact with your Supabase database and auth system.
 * 
 * The createClient function is provided by the @supabase/supabase-js library.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
