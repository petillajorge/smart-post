import { supabase } from '../../lib/supabaseClient';

async function handleSignOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    alert('Error signing out');
  }
}

export default handleSignOut;