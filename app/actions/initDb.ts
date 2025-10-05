"use server"

import * as z from 'zod'
import { User, Vault } from '../db/schema';
import dbConnect from '../db/intit';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';



const UserSignUp  = z.object({
    email:z.email(),
    password:z.string().min(8,"Min 8 char password required")
})


export const signUp = async (email: String, password: String) => {
    try {
        await dbConnect();

        const validation = UserSignUp.safeParse({ email, password });
        if (!validation.success) {
           
            return {
                success: false,
                message: "Invalid input",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, message: "User with this email already exists" };
        }

        const newUser = await User.create({
            email: email,
            password: password,
        });

        return {
            success: true,
            message: "User created successfully",
            user: newUser,
        };
    } catch (error) {
        console.error("Error during sign up:", error);
        return {
            success: false,
            message: "An unexpected error occurred",
        };
    }
};

const VaultCheck  = z.object({
    title:z.string(),
    password:z.string(),
    Url:z.string().optional(),
    Notes:z.string().optional()
})
export const saveTOVault= async (title:String,password:String,Url:String,Notes:String)=>{
     await dbConnect();
    const session = await getServerSession(authOptions);
    
    
    if(!session?.user){
        return null;
    }

    const verifyVault = await VaultCheck.safeParse({title,password,Url,Notes});
 
    if(!verifyVault.success){
        return null;
    }

//@ts-ignore
    const newVault  = await  Vault.create({title,password,Url,Notes,userID:session?.user?.id});
console.log(newVault);

    if(!newVault){
        return null;
    }

    return true;
}


export const showVaults=async () =>{

    await dbConnect();

    const session = await getServerSession(authOptions);
    
    if(!session?.user){
        return null;
    }

//@ts-ignore
    const vaults = await Vault.find({userID:session.user.id}).select('-userID');
    
   
    return JSON.parse(JSON.stringify(vaults));
}


export const deleteVault=async (id:String) =>{
    await dbConnect();
if(!id){
    return null;
}
console.log(id);


const res  = await Vault.findByIdAndDelete(id);

if(res.status==200){
    return true;
}

return false;
}


export const getVault =async(id:any)=>{
await dbConnect();

const data  = await Vault.findById(id);
if(!data){
    return null;
}
return JSON.parse(JSON.stringify(data));
}


export const editTOVault= async (title:String,password:String,Url:String,Notes:String,id:any)=>{
     await dbConnect();
    

    const verifyVault = await VaultCheck.safeParse({title,password,Url,Notes});
 
    if(!verifyVault.success){
        return null;
    }


    const editedVault  = await  Vault.findByIdAndUpdate(id,{$set:{title,password,Url,Notes}});
console.log(editedVault);

    if(!editedVault){
        return null;
    }

    return true;
}