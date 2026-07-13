const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://ezwzysgivgknvyvartfy.supabase.co', 'sb_publishable_srRCtr4mzqwOjASQ4fMaCQ_-cErZ5NM');

async function test() {
  const { data, error } = await supabase.from('students').select('*');
  console.log('Error:', error);
  console.log('Data:', data);
}

test();
