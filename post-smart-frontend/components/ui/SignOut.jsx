import { supabase } from '../../lib/supabaseClient';

const SignOut = () => {
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      console.error('Error signing out:', error);
      alert('Error signing out');
    }
  }
  return (<button onClick={handleSignOut}>Sign Out</button>);
}

export default SignOut;