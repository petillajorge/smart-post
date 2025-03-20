import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient = createClient(supabaseUrl, supabaseAnonKey); // Initialize the client once

export const supabase = supabaseClient; // Export the single instance

export const setAuthenticatedSupabaseClient = (token) => {
  supabaseClient.auth.setSession({
    access_token: token,
    token_type: 'Bearer',
    expires_in: 3600, // Or the actual expiration time from your session
    refresh_token: null, // Refresh token is not needed for this use case
  });
};

export const clearAuthenticatedSupabaseClient = () => {
  supabaseClient.auth.setSession(null);
};