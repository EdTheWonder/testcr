import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fysppcjxvfkswhfkdaqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5c3BwY2p4dmZrc3doZmtkYXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2NDk3NDUsImV4cCI6MjA0NTIyNTc0NX0.Ab5fDSoifcTHdxH_nwb3KwS8Qm3FaW1dpaf19VHxejc';

export const supabase = createClient(supabaseUrl, supabaseKey);