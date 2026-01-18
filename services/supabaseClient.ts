import { createClient } from '@supabase/supabase-js';

// Helper to safely get env vars without crashing if process is undefined
const getEnv = (key: string) => {
  try {
    // Check for standard process.env (bundlers)
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return process.env[key];
    }
    // Check for window.process.env (browser polyfill)
    if (typeof window !== 'undefined' && (window as any).process?.env?.[key]) {
      return (window as any).process.env[key];
    }
  } catch (e) {
    // ignore
  }
  return undefined;
};

// Default to a syntactically valid URL to prevent 'Invalid URL' constructor errors
const DEFAULT_URL = 'https://placeholder.supabase.co';
const DEFAULT_KEY = 'placeholder-key';

const envUrl = getEnv('SUPABASE_URL');
const envKey = getEnv('SUPABASE_ANON_KEY');

// Use env vars if available, otherwise fallback to defaults
const supabaseUrl = (envUrl && envUrl !== 'YOUR_SUPABASE_URL_HERE') ? envUrl : DEFAULT_URL;
const supabaseKey = (envKey && envKey !== 'YOUR_SUPABASE_ANON_KEY_HERE') ? envKey : DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => {
    return supabaseUrl !== DEFAULT_URL;
};

// Helper to check connection
export const checkConnection = async () => {
    // If using placeholder, don't even try network
    if (!isSupabaseConfigured()) return false;

    try {
        const { data, error } = await supabase.from('lab_tests').select('count', { count: 'exact', head: true });
        if (error) throw error;
        return true;
    } catch (e) {
        console.warn("Supabase connection check failed:", e);
        return false;
    }
};