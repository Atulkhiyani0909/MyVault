'use client'
import { editToVault, getVault } from "@/app/actions/initDb";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from "react";
import CryptoJS from 'crypto-js'; // <-- Import CryptoJS

// Give the component a proper name for Next.js routing
export default function EditVaultPage() {
    const params = useParams();
    const router = useRouter();

    // State for form fields
    const [title, setTitle] = useState("");
    const [Url, setUrl] = useState("");
    const [Notes, setNotes] = useState("");
    const [showpass, setshowpass] = useState("");

    // State for password generator
    const [value, setValue] = useState(12);
    const [number, setNumber] = useState(false);
    const [char, setChar] = useState(false);


    const [loading, setLoading] = useState(false);


    useEffect(() => {
        function genPass() {
            let pass = ""
            let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            if (char) str += "!@#$%^&*-_+=[]{}~`";
            if (number) str += "0123456789";
            for (let i = 0; i < value; i++) {
                let char = Math.floor(Math.random() * str.length)
                pass += str.charAt(char)
            }
            setshowpass(pass);
        }
        genPass();
    }, [value, number, char]);


    const fetchAndDecryptVault = useCallback(async () => {

        let masterKey = sessionStorage.getItem('masterKey');
        if (!masterKey) {

            const promptedKey = prompt("Please enter your master password to edit this vault:");
            if (!promptedKey) {
                alert("Master password is required to proceed.");
                router.push('/dashboard');
                return;
            }
            sessionStorage.setItem('masterKey', promptedKey);
            masterKey = promptedKey;
        }

        try {

            const vaultData = await getVault(params.vaultId as string);
            if (!vaultData) {
                throw new Error("Vault not found.");
            }


            const bytes = CryptoJS.AES.decrypt(vaultData.encryptedPayload, masterKey);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedString) {
                throw new Error("Decryption failed - the master key is likely incorrect.");
            }
            const decrypted = JSON.parse(decryptedString);


            setTitle(vaultData.title);
            setUrl(decrypted.url || '');
            setNotes(decrypted.notes || '');
            setshowpass(decrypted.password || '');

        } catch (error) {
            console.error("Failed to fetch or decrypt vault:", error);
            alert((error as Error).message);
            sessionStorage.removeItem('masterKey');
            router.push('/dashboard');
        }
    }, [params.vaultId, router]);


    useEffect(() => {
        fetchAndDecryptVault();
    }, [fetchAndDecryptVault]);

    function clipboard() {
        navigator.clipboard.writeText(showpass);
    }


    async function handleSaveChanges() {
        if (!title) {
            return alert("Enter Title");
        }

        const masterKey = sessionStorage.getItem('masterKey');
        if (!masterKey) {
            alert("Your session has expired. Please go back and unlock your vaults again.");
            return;
        }

        setLoading(true);
        try {

            const dataToEncrypt = {
                password: showpass,
                url: Url,
                notes: Notes
            };


            const encryptedPayload = CryptoJS.AES.encrypt(
                JSON.stringify(dataToEncrypt),
                masterKey
            ).toString();


            const res = await editToVault(title, encryptedPayload, params.vaultId as string);

            if (!res) {
                throw new Error("Saving to the database failed.");
            }

            alert("Vault updated successfully!");
            router.push('/dashboard');

        } catch (error) {
            console.error("Failed to save changes:", error);
            alert((error as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (

        <div className="bg-gray-900 min-h-screen text-white font-sans p-4 flex items-center justify-center">
            <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Edit Vault Entry</h1>
                    <p className="text-gray-400 mt-1">Update the details for this item.</p>
                </div>

                <div className="space-y-4">

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input id="title" type="text" required value={title} placeholder="e.g., Google Account" className="w-full px-4 py-2 text-gray-200 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <div className="relative flex items-center">
                            <input id="password" value={showpass} type="text" placeholder="Generate or enter a password" className="w-full pl-4 pr-12 py-2 text-gray-200 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" onChange={(e) => setshowpass(e.target.value)} />
                            <button onClick={clipboard} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white transition" title="Copy to clipboard">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z"></path></svg>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">URL <span className="text-gray-500">(Optional)</span></label>
                        <input id="url" type="url" placeholder="https://google.com" value={Url} className="w-full px-4 py-2 text-gray-200 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" onChange={(e) => setUrl(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes <span className="text-gray-500">(Optional)</span></label>
                        <textarea id="notes" placeholder="e.g., Recovery email is..." className="w-full px-4 py-2 text-gray-200 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition" rows={3} value={Notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                </div>

                <details className="bg-gray-900/50 border border-gray-700 rounded-lg open:bg-gray-900/80 transition">
                    <summary className="cursor-pointer list-none p-4 font-semibold flex justify-between items-center">Password Generator Options
                        <svg className="w-5 h-5 transition-transform duration-300 transform details-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </summary>
                    <div className="p-4 border-t border-gray-700 space-y-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="length" className="text-gray-300">Password Length</label>
                            <span className="font-bold text-blue-400 text-lg">{value}</span>
                        </div>
                        <input id="length" type="range" min={6} max={26} value={value} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" onChange={(e) => setValue(Number(e.target.value))} />
                        <div className="flex items-center justify-around pt-2">
                            <div className="flex items-center">
                                <input id="number" onChange={() => { setNumber(!number) }} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600" />
                                <label htmlFor="number" className="ml-2 text-sm text-gray-300">Numbers</label>
                            </div>
                            <div className="flex items-center">
                                <input id="char" onChange={() => { setChar(!char) }} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600" />
                                <label htmlFor="char" className="ml-2 text-sm text-gray-300">Special Characters</label>
                            </div>
                        </div>
                    </div>
                </details>
                <div className="flex flex-col sm:flex-row-reverse items-center gap-3 pt-4">
                    <button type="button" disabled={loading || !title} onClick={handleSaveChanges} className="w-full sm:w-auto flex justify-center items-center px-6 py-2.5 font-bold text-white rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:text-gray-400 disabled:cursor-not-allowed">
                        {loading ? (<> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</>) : ('Save Changes')}
                    </button>
                    <button type="button" onClick={fetchAndDecryptVault} className="w-full sm:w-auto px-6 py-2.5 font-bold text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500">
                        Reset
                    </button>
                </div>
            </div>
            <style jsx>{`
                 details[open] .details-arrow {
                     transform: rotate(180deg);
                 }
             `}</style>
        </div>
    );
}