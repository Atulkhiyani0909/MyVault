'use client'

import { useEffect, useState } from "react"
import { deleteVault, showVaults } from "../actions/initDb";
import { useRouter } from "next/navigation";


interface VautsType {
    title: String,
    password: String,
    Notes: String,
    Url: String,
    _id:String
}

export function ShowVaults() {
    const [vaults, setVaults] = useState([])
    const router = useRouter()

    //   useEffect(() => {
    //     const fetchData = async () => {
    //         const data:any = await showVaults();
    //         console.log("From call ", data);
    //         setVaults(data);
    //     };

    //     fetchData();

    //     // const intervalId = setInterval(fetchData,2000);

    //     //necessary step
    //     // return () => clearInterval(intervalId);

    // }, [vaults]); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await showVaults();
                console.log("From call ", data);
                setVaults(data);
            } catch (error) {
                console.error("Failed to fetch vaults:", error);
            }
        };

        fetchData();
    }, []);

    
    

    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">All Vaults</h1>
                <br /><br />
                {/* Responsive Grid Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vaults.map((val: VautsType, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-between bg-gray-800 rounded-lg shadow-lg border border-gray-700 transition-transform hover:scale-105"
                        >
                            {/* Card Header */}
                            <div className="p-4 border-b border-gray-700">
                                <h2 className="text-xl font-bold text-blue-400">{val.title}</h2>
                                {val.Url && <p className="text-sm text-gray-400 truncate">{val.Url}</p>}
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-2">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold">PASSWORD</p>
                                    <p className="text-gray-300 font-mono">{val.password}</p>
                                </div>
                                {val.Notes && (
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold">NOTES</p>
                                        <p className="text-gray-400 italic">{val.Notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer with Actions */}
                            <div className="p-2 bg-gray-900/50 rounded-b-lg flex justify-end space-x-2">
                                <button className="px-3 py-1 text-sm text-yellow-400 hover:bg-yellow-400/10 rounded-md" onClick={()=>{
                                    router.push(`/editVault/${val._id}`)
                                }}>
                                    Edit
                                </button>
                                <button className="px-3 py-1 text-sm text-red-400 hover:bg-red-400/10 rounded-md" onClick={async ()=>{
                                    console.log(val._id);
                                    
                                    await deleteVault(val._id);
                                }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}