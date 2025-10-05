'use client';

import { useEffect, useState } from "react";
import { deleteVault, showVaults } from "../actions/initDb";
import { useRouter } from "next/navigation";
import CryptoJS from 'crypto-js';

interface VaultsType {
    title: string,
    encryptedPayload: string,
    _id: string
}

interface DecryptedDataType {
    password?: string,
    url?: string,
    notes?: string
}

export function ShowVaults() {
    const [vaults, setVaults] = useState<VaultsType[]>([]);
    const router = useRouter();

    const [masterKey, setMasterKey] = useState<string | null>(null);
    const [decryptedData, setDecryptedData] = useState<Record<string, DecryptedDataType>>({});
    
  
    const [searchQuery, setSearchQuery] = useState('');

   
    useEffect(() => {
        const storedKey = sessionStorage.getItem('masterKey');
        if (storedKey) {
            setMasterKey(storedKey);
        }

        const fetchData = async () => {
            try {
                const data = await showVaults();
                if (data) {
                    setVaults(data);
                }
            } catch (error) {
                console.error("Failed to fetch vaults:", error);
            }
        };
      
      
        fetchData();

       
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

      
        return () => clearInterval(interval);
    }, []);

    const handleDecrypt = (vaultId: string, encryptedPayload: string) => {
        let key = masterKey;

        if (!key) {
            const promptedKey = prompt("Please enter your master password to view details:");
            if (!promptedKey) {
                return;
            }
            sessionStorage.setItem('masterKey', promptedKey);
            setMasterKey(promptedKey);
            key = promptedKey;
        }

        try {
            const bytes = CryptoJS.AES.decrypt(encryptedPayload, key);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            
            if (!decryptedString) {
                throw new Error("Wrong master key.");
            }

            const decryptedObject: DecryptedDataType = JSON.parse(decryptedString);

            setDecryptedData(prev => ({
                ...prev,
                [vaultId]: decryptedObject
            }));
        } catch (error) {
            console.error("Decryption failed:", error);
            alert("Decryption failed. The master key may be incorrect.");
            sessionStorage.removeItem('masterKey');
            setMasterKey(null);
        }
    };

    
    const filteredVaults = vaults.filter(vault =>
        vault.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

       function clipboard(pass) {
   
        navigator.clipboard.writeText(pass).then(() => {
        console.log("Password copied to clipboard!");

        //now set for autoclear after 15 sec
        setTimeout(() => {
            navigator.clipboard.writeText("").then(() => {
                console.log("Clipboard cleared after 15s!");
            }).catch(err => {
                console.error("Failed to clear clipboard:", err);
            });
        }, 15000); 
    }).catch(err => {
        console.error("Failed to copy:", err);
    });
}

    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-white">All Vaults</h1>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('masterKey');
                            setMasterKey(null);
                            setDecryptedData({});
                        }}
                        className="px-3 py-1 text-sm text-gray-400 hover:bg-gray-700 rounded-md flex items-center gap-1.5"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3.5 8H6.5V5.5a3.5 3.5 0 117 0V9z" clipRule="evenodd" />
                        </svg>
                        Lock Vaults
                    </button>
                </div>

                
                <div className="mb-6 relative">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 text-gray-200 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {filteredVaults.map((val) => (
                        <div
                            key={val._id.toString()}
                            className="flex flex-col justify-between bg-gray-800 rounded-lg shadow-lg border border-gray-700"
                        >
                            <div className="p-4 border-b border-gray-700">
                                <h2 className="text-xl font-bold text-blue-400">{val.title}</h2>
                            </div>

                            <div className="p-4 space-y-3 flex-grow">
                                {decryptedData[val._id.toString()] ? (
                                    <>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold">URL</p>
                                            <p className="text-gray-300 break-all">{decryptedData[val._id.toString()].url || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold">Password</p>
                                            <p className="text-gray-300">{decryptedData[val._id.toString()].password}</p>
                                            {" "}
                                            <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={()=>{
                                                clipboard(decryptedData[val._id.toString()].password)
                                            }}>Copy</button>
                                        </div>
                                         <div>
                                            <p className="text-xs text-gray-500 font-semibold">Notes</p>
                                            <p className="text-gray-400 italic">{decryptedData[val._id.toString()].notes || 'N/A'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <p className="text-gray-500">Data is encrypted.</p>
                                        <button 
                                            onClick={() => handleDecrypt(val._id.toString(), val.encryptedPayload)}
                                            className="mt-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-2 bg-gray-900/50 rounded-b-lg flex justify-end space-x-2">
                                {decryptedData[val._id.toString()] && (
                                    <button 
                                        className="px-3 py-1 text-sm text-gray-400 hover:bg-gray-400/10 rounded-md"
                                        onClick={() => setDecryptedData(prev => {
                                            const newState = {...prev};
                                            delete newState[val._id.toString()];
                                            return newState;
                                        })}
                                    >
                                        Hide
                                    </button>
                                )}
                                <button className="px-3 py-1 text-sm text-yellow-400 hover:bg-yellow-400/10 rounded-md" onClick={() => router.push(`/editVault/${val._id}`)}>
                                    Edit
                                </button>
                                <button className="px-3 py-1 text-sm text-red-400 hover:bg-red-400/10 rounded-md" onClick={async () => {
                                    if (confirm(`Are you sure you want to delete "${val.title}"?`)) {
                                        await deleteVault(val._id);
                                        setVaults(vaults.filter(v => v._id !== val._id)); 
                                    }
                                }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
