"use server"

import * as z from 'zod'
import { User, Vault } from '../db/schema';
import dbConnect from '../db/intit';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import bcrypt from 'bcryptjs';



const UserSignUp = z.object({
    email: z.email(),
    password: z.string().min(8, "Min 8 char password required")
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

const NewVaultCheck = z.object({
  title: z.string().min(1, "Title is required"),
  encryptedPayload: z.string().min(1, "Encrypted payload is required"),
});



export const saveTOVault = async (title: string, encryptedPayload: string) => {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return null;
    }

    
    const verifyVault = NewVaultCheck.safeParse({ title, encryptedPayload });

    if (!verifyVault.success) {
       
        return null;
    }

    
    
    const newVault = await Vault.create({ 
        title: title, 
        encryptedPayload: encryptedPayload, 
        userID: session?.user?.id 
    });
    
    console.log("Saved new encrypted vault:", newVault);

    if (!newVault) {
        return null;
    }

    return true;
}


export const showVaults = async () => {

    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return null;
    }

    //@ts-ignore
    const vaults = await Vault.find({ userID: session.user.id }).select('-userID');


    return JSON.parse(JSON.stringify(vaults));
}


export const deleteVault = async (id: String) => {
    await dbConnect();
    if (!id) {
        return null;
    }
    console.log(id);


    const res = await Vault.findByIdAndDelete(id);

    if (res.status == 200) {
        return true;
    }

    return false;
}


export const getVault = async (id: any) => {
    await dbConnect();

    const data = await Vault.findById(id);
    if (!data) {
        return null;
    }
    return JSON.parse(JSON.stringify(data));
}






export const editToVault = async (title: string, encryptedPayload: string, id: string) => { // <-- 1. id is now string
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return null;
    }

    const verifyVault = NewVaultCheck.safeParse({ title, encryptedPayload });

    if (!verifyVault.success) {
        return null;
    }
    
    
    //@ts-ignore
    const existingVault = await Vault.findOne({ _id: id, userID: session.user.id });

    if (!existingVault) {
       
        return null; 
    }
    
   
    const updatedVault = await Vault.findByIdAndUpdate(id, { 
        title: title, 
        encryptedPayload: encryptedPayload,
    }, { 
        new: true 
    });
    
    console.log("Updated encrypted vault:", updatedVault);

    if (!updatedVault) {
        return null;
    }

    return true;
}


export const getPass = async (pass: any) => {
    console.log(pass);
    
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return null;
    }

    //@ts-ignore
    const userDetails = await User.findById(session?.user.id);
    
    const passwordVerify = await bcrypt.compare(pass, userDetails.password);

    if (!passwordVerify) {
        return false;
    }


    return true

}