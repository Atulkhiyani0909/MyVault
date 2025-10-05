'use client'

import { useEffect, useState } from "react"
import { saveTOVault } from "../actions/initDb"

export function GenPassword() {
    const [showpass, setshowpass] = useState("")
    const [value, setValue] = useState(12)
    const [number, setNumber] = useState(false)
    const [char, setChar] = useState(false)
    const [title, setTitle] = useState("");
    const [url,setUrl]=useState("");
    const [notes,setNotes]=useState("");
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        function genPass() {
            let pass = ""
            let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            if (char) str += "!@#$%^&*-_+=[]{}~`";
            if (number) str += "0123456789";

            for (let i = 0; i < value; i++) {
                let char = Math.floor(Math.random() * str.length + 1)
                pass += str.charAt(char)
            }
            setshowpass(pass);
        }
        genPass();
    }, [value, number, char])



    function clipboard() {
        navigator.clipboard.writeText(showpass);
    }

    async function saveToDB(){
        if(!title){
            return alert("Enter Title");
        }
        setLoading(true);
        const res = await saveTOVault(title,showpass,url,notes)
        setLoading(false);
        setTitle("");
        setUrl("");
        setNotes("");
        console.log(res);
        if(!res){
            return alert("Saving to DB Failed")
        }

    }
 
    

    return (
      <div className="bg-gray-900 text-white font-sans p-4">
    {/* Removed full-screen centering and reduced padding/spacing for a more compact card */}
    <div className="w-full max-w-md mx-auto p-6 space-y-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        
        {/* Vault Entry Section */}
        <div>
            <h2 className="text-xl font-bold text-center mb-4">Save to Vault</h2>
            <div className="space-y-3">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input
                        id="title"
                        type="text"
                        required
                        placeholder="e.g., Google Account"
                        className="w-full px-3 py-2 text-sm text-gray-200 bg-gray-900/60 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e)=>setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-400 mb-1">URL (Optional)</label>
                    <input
                        id="url"
                        type="url"
                        placeholder="https://google.com"
                        className="w-full px-3 py-2 text-sm text-gray-200 bg-gray-900/60 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e)=>setUrl(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">Notes (Optional)</label>
                    <textarea
                        id="notes"
                        placeholder="e.g., Recovery email is..."
                        className="w-full px-3 py-2 text-sm text-gray-200 bg-gray-900/60 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2} 
                        onChange={(e)=>setNotes(e.target.value)}
                    />                </div>
            </div>
        </div>

        
        <hr className="border-gray-700" />

        
        <div>
            <h2 className="text-lg font-bold text-center mb-3">Password Generator</h2>
            <div className="flex mb-3">
                <input
                value={showpass}
                    type="text"
                    placeholder="Click Generate"
                    className="flex-grow p-2 text-sm bg-gray-900 border border-gray-700 rounded-l-md focus:outline-none"
                    readOnly
                />
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md font-semibold transition-colors"
                 onClick={clipboard}
                >
                    Copy
                </button>
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label htmlFor="length" className="text-base">Password Length</label>
                    <span className="font-bold text-blue-400 text-base">{value}</span>
                </div>
                <input
                    id="length"
                    type="range"
                    min={6}
                    max={26}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    onChange={(e:any)=>setValue(e.target.value)}
                />
                <div className="flex items-center justify-around pt-1">
                    <div className="flex items-center">
                        <input id="number"  onChange={()=>{setNumber(!number)}} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"/>
                        <label  htmlFor="number"  className="ml-2 text-sm">Numbers</label>
                    </div>
                    <div className="flex items-center">
                        <input id="char"  onChange={()=>{setChar(!char)}}  type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"/>
                        <label   htmlFor="char" className="ml-2 text-sm">Characters</label>
                    </div>
                </div>
            </div>
        </div>

      
        <button
  type="button"

  disabled={loading}
  onClick={saveToDB}

  className="w-full flex justify-center items-center py-2 mt-4 font-bold text-white rounded-md transition-colors
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
             
             // Classes for the enabled state
             bg-green-600 hover:bg-green-700
             
             // Classes for the disabled (loading) state
             disabled:bg-green-400 disabled:cursor-not-allowed"
>
  {loading ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white motion-reduce:hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </>
  ) : (
    'Save to Vault'
  )}
</button>
    </div>
</div>
    )
}