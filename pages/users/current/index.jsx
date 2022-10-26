import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import ProfilePicture from '../../../components/ProfilePicture';

export default function CurrentProfile({ session }) {
    const supabase = useSupabaseClient();
    const user = useUser();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(null);
    const [cpf, setCpf] = useState('');
    const [address, setAddress] = useState(null);
    const [photoURL, setPhotoURL] = useState(null);
    const [accessGroup, setAccessGroup] = useState(2);
    const [status, setStatus] = useState('active');

    useEffect(() => {
        getUserProfile()
    }, [session])

    async function getUserProfile() {
        try {
            setLoading(true);

            if (!user) throw new Error('No user');

            let { data, error, status } = await supabase
                .from('users')
                .select(`full_name, cpf, address, photo_url, access_group, status`)
                .eq('id', user && user.id)
                .single();

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setName(data.full_name);
                setCpf(data.cpf);
                setAddress(data.address);
                setPhotoURL(data.photo_url);
                setAccessGroup(data.access_group);
                setStatus(data.status);
            }
        } catch (error) {
            alert('Error loading user data!');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(evt) {
        evt && evt.preventDefault();
        
        try {
            setLoading(true)
            if (!user) throw new Error('No user');

            const updates = {
                id: user.id,
                full_name: name,
                cpf,
                address,
                photo_url: photoURL,
                access_group: accessGroup,
                status,
                updated_at: new Date().toISOString(),
            }

            let { error } = await supabase.from('users').upsert(updates);

            if (error) throw error;
            alert('Profile updated!');
        } catch (error) {
            alert('Error updating the data!');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    function onCPFChange(value) {
        if (!value) return ``;

        let cpf = "";
        let parts = Math.ceil(value.length / 3);

        for (let i = 0; i < parts; i++) {
            if (i === 3) {
                cpf += `-${value.substr(i * 3)}`;
                break;
            }
            cpf += `${i !== 0 ? "." : ""}${value.substr(i * 3, 3)}`;
        }

        return cpf;
    }

    if(!user) return <h1>No data to display!</h1>

    return (
        <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                        <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
                    </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <form action="#" method="POST" onSubmit={updateProfile}>
                        <div className="overflow-hidden shadow sm:rounded-md">
                            <div className="bg-white px-4 py-5 sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <ProfilePicture
                                            uid={user.id}
                                            url={photoURL}
                                            size={150}
                                            onUpload={(url) => {
                                                setPhotoURL(url);
                                                updateProfile();
                                            }}
                                        />
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                type="text"
                                                value={session.user.email}
                                                disabled
                                                autoComplete="email"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={name || ''}
                                                onChange={(event) => setName(event.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                                                CPF
                                            </label>
                                            <input
                                                id="cpf"
                                                type="text"
                                                value={onCPFChange(cpf) || ''}
                                                maxLength="14"
                                                onChange={(event) => setCpf(event.target.value.replace(/\D/g, ""))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                id="address"
                                                type="text"
                                                value={address || ''}
                                                onChange={(event) => setAddress(event.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="accessGroup" className="block text-sm font-medium text-gray-700">Acess Group</label>
                                            <select
                                                name="accessGroup"
                                                id="accessGroup"
                                                value={accessGroup?.toString() || ''}
                                                onChange={(event) => setAccessGroup(Number.parseInt(event.target.value))}
                                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="1">Administrators</option>
                                                <option value="2">Visitors</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        {loading ? 'Loading ...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
