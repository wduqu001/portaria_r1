import '../styles/globals.css';
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Nav from '../components/Nav';

function MyApp({
  Component,
  pageProps,
}) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
        <Nav/>
        <Component {...pageProps} />
    </SessionContextProvider>
  )
}

export default MyApp
