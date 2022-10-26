import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Logout() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const router = useRouter();

    useEffect(() => {
        logout();
    }, [session])

    function logout(evt) {
        evt && evt.preventDefault();

        supabase.auth.signOut()
            .then(() => console.log("User has sign out!"))
            .catch((err) => console.error("Error: ", err))
            .finally(() => {
                console.log("returning to home!");
                router.push('/');
            })
    }

    return (
        <>
        </>
    )
}

export default Logout;