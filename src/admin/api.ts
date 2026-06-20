import type { DB } from '../types/db';
import { supabase } from '../lib/supabase';

/**
 * Production save — calls the Netlify Function which uses the
 * Supabase service-role key (never exposed to the browser).
 */
export async function saveDB(db: DB, password: string): Promise<void> {
  const res = await fetch('/api/save-db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: db, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? 'Save failed');
  }
}

/**
 * Used in all admin pages.
 * - In local dev  → hits the Vite middleware  → writes to db.json (for easy testing) AND updates Supabase via RPC
 * - In production → hits /.netlify/functions/save-db → writes to Supabase
 */
export async function saveDBLocal(db: DB): Promise<void> {
  // Check if we're running locally (Vite dev server) or on Netlify
  const isLocal = import.meta.env.DEV;

  if (isLocal) {
    // Dev: write to local db.json via Vite middleware
    const res = await fetch('/api/save-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db),
    });
    if (!res.ok) throw new Error('Local save failed');

    // Also sync directly to Supabase via RPC helper function
    const { error } = await supabase.rpc('update_portfolio', { new_data: db });
    if (error) {
      console.error('Failed to sync to Supabase local dev:', error);
      throw new Error(`Supabase sync failed: ${error.message}`);
    }
  } else {
    // Production: save to Supabase via Netlify Function
    const password = import.meta.env.VITE_ADMIN_PASSWORD as string;
    await saveDB(db, password);
  }
}
