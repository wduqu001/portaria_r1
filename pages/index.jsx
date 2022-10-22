import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

import UserProfile from '../components/UserProfile';

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
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
        <>
          
          <h3>User profile</h3>
          <UserProfile session={session} />
        </>
      )}

    </div>
  )
}

export default Home
