import { createClient } from '@supabase/supabase-js';

const PASSWORD      = process.env.VITE_ADMIN_PASSWORD;
const SUPABASE_URL  = process.env.VITE_SUPABASE_URL!;
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY!;  // never exposed to browser

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data: dbData, password } = req.body || {};

    // Auth check
    if (!PASSWORD || password !== PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return res.status(500).json({ error: 'Supabase env vars not configured' });
    }

    // Service-role client — bypasses RLS, can write
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });

    const { error } = await supabase
      .from('portfolio')
      .upsert({ id: 1, data: dbData, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
