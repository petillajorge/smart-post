import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Adjust the path as needed

const AutoLogout = () => {
  useEffect(() => {
    const autoLogout = async () => {
      try {
        const session = await supabase.auth.getSession();
        //console.log(`Your current session ${session.data.session} is going to be log out now.`)
        if (session.data?.session) {
          await supabase.auth.signOut();
          //console.log('User automatically logged out.');
        } else {
          //console.log('No user session found.');
        }
      } catch (error) {
        //console.error('Error during auto logout:', error);
      }
    };

    autoLogout();
  }, []);

  return null; // This component doesn't render anything
};

export default AutoLogout;