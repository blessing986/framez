// Supabase client

import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hmnbszqpdhoxacforjvc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbmJzenFwZGhveGFjZm9yanZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MzIxMzQsImV4cCI6MjA3ODIwODEzNH0.SZz1kr98Pe8yfCF0LLkXQdTW3WjxyHpTmQNWBQHC65s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
