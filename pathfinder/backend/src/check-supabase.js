import { createSupabaseClient } from './supabase.js';

try {
  const supabase = createSupabaseClient();
  const table = process.argv[2] || 'courses';
  const { data, error } = await supabase.from(table).select('*').limit(1);
  if (error) throw error;
  console.log('Supabase table query succeeded!');
  console.log('Table:', table);
  console.log('Rows returned:', data.length);
  if (data.length) console.log('Columns:', Object.keys(data[0]).join(', '));
  else console.log('The query succeeded; the table returned no rows.');
} catch (error) {
  console.error('Supabase query failed:', error.message);
  process.exitCode = 1;
}
