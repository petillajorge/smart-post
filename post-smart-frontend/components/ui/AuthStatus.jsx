import { supabase } from '../../lib/supabaseClient';
import { useState, useEffect } from 'react';

function AuthStatus() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  return (
    <div>
      {user ? (
        <p>User is logged in: {user.email}</p>
      ) : (
        <p>User is logged out</p>
      )}
    </div>
  );
}

export default AuthStatus;