import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { email, password, full_name, role = 'orang_tua' } = await req.json();

    // Sign up user with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      return new Response(JSON.stringify({ error: signUpError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert profile data (if user id returned)
    const userId = signUpData.user?.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          role,
          full_name,
        });
      if (profileError) {
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
