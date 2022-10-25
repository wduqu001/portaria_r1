import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="p-4">
      {!session ? (
        <div className="row">
          <div className="col-6">
            <h1 className="header">Portaria R1</h1>
          </div>
          <div className="col-6 auth-widget">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
            />
          </div>
        </div>
      ) : (
          <header className="bg-white shadow">
            <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome to Portaria R1!</h1>
            </div>
          </header>
      )}

    </div>
  )
}

export default Home;
