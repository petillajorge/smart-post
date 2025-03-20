import { supabase } from '../../lib/supabaseClient';
import { useState } from 'react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createUserProfile = async (userId) => {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({ user_id: userId });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      setError('Error creating user profile. Please try again.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        // User signed up successfully
        if (data?.user?.id) {
          await createUserProfile(data.user.id);
        } else {
          setError('User ID not found after signup.');
        }

        setEmail('');
        setPassword('');
        alert('Signup successful! Check your email to confirm your account.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

  export default SignUp;