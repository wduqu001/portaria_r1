import { PlusIcon } from "@heroicons/react/24/outline";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";

export default function GroupsPage() {
    const supabase = useSupabaseClient();
    const auth = useUser();

    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGroups();
    }, [supabase]);

    async function getGroups() {
        try {
            setLoading(true);

            let { data, error, status } = await supabase
                .from('access_group')
                .select(`
                    id, 
                    name, 
                    created_at, 
                    updated_at
                `);

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setGroups(data);
            }
        } catch (error) {
            alert('Error loading user data!');
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function createNewGroup(evt) {
        evt && evt.preventDefault();
        alert('function not yet implemented!');
    }

    return (
        <div className="p-4">
            <header className="bg-white shadow">
                <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Acess Groups</h1>
                    {/* <div className="mt-4 whitespace-nowrap">
                        <button
                            className="active:bg-gray-700 bg-transparent border border-gray-600 border-solid btn-copy-code duration-150 ease-linear focus:outline-none font-bold hover:bg-gray-500 hover:text-white mb-1 mr-1 outline-none px-4 py-2 rounded text-gray-600 text-sm transition-all uppercase"
                            onClick={(evt) => createNewGroup(evt)}
                            disabled
                        >
                            Create new group
                            <PlusIcon className="inline-block h-6 w-6 text-bg-800 py-1 font-we" aria-hidden="true" />
                        </button>
                    </div> */}
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 overflow-hidden">
                        <table className="table-auto">
                            <thead className="border-b bg-gray-800">
                                <tr>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Id</th>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Name</th>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Created at</th>
                                    <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Updated at</th>
                                    {/* <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left"></th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {groups && groups.map((group, idx) =>
                                    <tr key={idx} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.id}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{group.name}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{group.created_at}</td>
                                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{group.updated_at}</td>
                                        {/* <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                            <Link
                                                href={`/groups/edit/${groups.id}`}
                                            >
                                                <a
                                                    className="active:bg-blue-600 bg-transparent border border-blue-500 border-solid btn-copy-code duration-150 ease-linear focus:outline-none font-bold hover:bg-blue-500 hover:text-white mb-1 mr-1 outline-none px-4 py-2 rounded text-blue-500 text-sm transition-all uppercase"
                                                >
                                                    Edit
                                                </a>
                                            </Link>
                                        </td> */}
                                    </tr>
                                )}
                                {!groups &&
                                    <tr>
                                        <td colSpan="4">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {groups && !groups.length &&
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            <div className="p-2">No groups to display</div>
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