import { createClient } from "@supabase/supabase-js";

const supabaserUrl = 'https://wmbotszljgdszdptalwb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYm90c3psamdkc3pkcHRhbHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2NjA1MTcsImV4cCI6MjAzOTIzNjUxN30.58G_lYnMHjrUea0U6YivXT0eKlMPQU9E8Fc3SJp-2Us'
export const supabase= createClient(supabaserUrl, supabaseKey)