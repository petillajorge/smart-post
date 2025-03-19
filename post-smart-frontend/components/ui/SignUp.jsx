import { supabase } from '../../lib/supabaseClient';
import { useState } from 'react';

function SignUpWithEmail() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error signing up:', error);
      alert('Error signing up');
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
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}

  export default SignUpWithEmail;