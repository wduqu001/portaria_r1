import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(event, currentSession);

        switch (event) {
          case 'PASSWORD_RECOVERY':
            router.push('/recovery');
            break;
          case 'SIGNED_IN':
            console.log("user has signed in");
            break;
          default:
            console.log(event, currentSession);
            break;
        }
      }
    );
  }, []);

  return (
    <div className="p-4">
      {!session ? (
        <>
          <div className="min-h-screen bg-gray-50 flex flex-col p-8">
            <div className="mb-8 sm:max-w-md sm:w-full">
              <h1 className="text-3xl font-bold text-gray-900">Portaria R1</h1>
            </div>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
              view='magic_link'
            />
          </div>
        </>
      ) : (
        <header className="bg-white shadow">
          <div className="max-w-3xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Portaria R1!</h1>
          </div>
        </header>
      )}

    </div>
  )
}

export default Home;
