import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wzoiurncsjkpwtnuhsmx.supabase.co';
const supabaseKey = 'sb_publishable_OFVqoPIPCCZEx8fSuFjA8w_YzbNHuNP';

export const supabase = createClient(supabaseUrl, supabaseKey);