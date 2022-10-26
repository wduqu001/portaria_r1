import { PlusIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";

export default function UsersPage() {
    const supabase = useSupabaseClient();
    const auth = useUser();

    const [users, setUsers] = useState([]);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers();
    }, [supabase]);

    async function getUsers() {
        try {
            setLoading(true);

            let { data, error, status } = await supabase
                .from('users')
                .select(`
                    full_name, 
                    cpf, 
                    address, 
                    photo_url, 
                    access_group, 
                    status,
                    id (auth.users),
                `);

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsers(data);
                setCurrentUserData(data.find((usr) => usr.id === auth.id));
            }
        } catch (error) {
            alert('Error loading user data!');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function inviteUser(evt) {
        evt && evt.preventDefault();
        
        try {
            setLoading(true);
            const email = window.prompt('Invite new user', 'Inform the email here!');
            
            if(!email) return;

            const { data, error, status } = await supabase.auth.admin.inviteUserByEmail(email);

            if (error && status !== 406) {
                throw error;
            }

            if (data) console.dir(data)

        } catch (error) {
            alert('Error loading user data!');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function inactiveUser(evt, id) {
        evt && evt.preventDefault();

        try {
            setLoading(true);

            if (!id) throw new Error('No user was selected');

            let { data, error, status } = await supabase
                .from('users')
                .update({
                    status: 'inactive'
                })
                .eq('id', user.id)
                .select();

            if (error && status !== 406) {
                throw error;
            }

            console.log("user has been inactived: ", data)

        } catch (error) {
            alert('Error loading user data!');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">
            <header className="bg-white shadow">
                <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <div className="mt-4 whitespace-nowrap">
                        <button
                            className="active:bg-gray-700 bg-transparent border border-gray-600 border-solid btn-copy-code duration-150 ease-linear focus:outline-none font-bold hover:bg-gray-500 hover:text-white mb-1 mr-1 outline-none px-4 py-2 rounded text-gray-600 text-sm transition-all uppercase"
                            onClick={(evt) => inviteUser(evt)}
                        >
                            Add User
                            <PlusIcon className="inline-block h-6 w-6 text-bg-800 py-1 font-we" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 overflow-hidden">
                        <table className="table-auto">
                            <thead className="border-b bg-gray-800">
                                <tr>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Name</th>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">CPF</th>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Address</th>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Access group</th>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Status</th>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map((user, idx) =>
                                    <tr key={idx} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.cpf ? "***" + user.cpf.substring(6) : '-'}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.address}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.access_group === 1 ? 'ADMINISTRATOR' : 'VISITOR'}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" style={{ textTransform: "uppercase" }}>{user.status}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                            <Link
                                                href={`/users/edit/${user.id}`}
                                            >
                                                <a
                                                    className="active:bg-blue-600 bg-transparent border border-blue-500 border-solid btn-copy-code duration-150 ease-linear focus:outline-none font-bold hover:bg-blue-500 hover:text-white mb-1 mr-1 outline-none px-4 py-2 rounded text-blue-500 text-sm transition-all uppercase"
                                                >
                                                    Edit
                                                </a>
                                            </Link>
                                            {
                                                currentUserData.access_group === 1 &&
                                                <button
                                                    onClick={(e) => inactiveUser(e, user.id)}
                                                    className="btn-copy-code text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    disabled={user.isDeleting}>
                                                    {user.isDeleting
                                                        ? <span className="spinner-border spinner-border-sm"></span>
                                                        : <span>Disable</span>
                                                    }
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                )}
                                {!users &&
                                    <tr>
                                        <td colSpan="4">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {users && !users.length &&
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            <div className="p-2">No users to display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}