import { supabase } from '../../lib/supabaseClient';
import { useState } from 'react';

function SignInWithEmail() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      //console.error('Error signing in:', error);
      alert('Error signing in');
    }

  }

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}
  export default SignInWithEmail;