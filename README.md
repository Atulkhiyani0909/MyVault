# 🔒 MyVault - A Secure, Client-Side Encrypted Password Manager

**MyVault** is a modern, secure password manager built with Next.js and designed with a **zero-knowledge security architecture**.  
All your sensitive data is encrypted and decrypted directly in your browser using a master password that is **never sent to the server**.

---

## 🎯 Project Goal (MVP)

This project is a **Minimum Viable Product (MVP)** built to fulfill a specific set of requirements for a fast, simple, and privacy-first password vault.

The core goal was to build a web app where a user can:

- ✅ Generate a strong, unique password with options for length, numbers, and symbols.  
- ✅ Save credentials to a personal, client-side encrypted vault.  
- ✅ Perform full **CRUD operations** (View, Edit, Delete) on saved entries.  
- ✅ Search and filter the vault items.  

This implementation covers all *must-have* features, demonstrating the complete flow from **user sign-up → generating → saving → searching → editing → deleting** a secure vault item.

---

## ✨ Core Features

- **Client-Side Encryption**: Data is encrypted with **AES** using your master password *before it ever leaves your device*.  
- **Zero-Knowledge Architecture**: Only you can decrypt your vault — the server cannot access your sensitive data.  
- **Full CRUD Functionality**: Create, view, edit, and delete entries.  
- **Built-in Password Generator**: Generate strong, unique passwords with customizable length and symbols.  
- **Secure Session Management**: Master password stored in `sessionStorage` for the session and cleared when you close the tab.  
- **Responsive & Modern UI**: Dark-themed, mobile-friendly interface built with Tailwind CSS.
-  **Clipboard** : clipboard autoclear after 15 sec (time set is for 15sec for now )

## 🔐 Crypto Note
This project uses **CryptoJS (AES encryption)** for client-side encryption.  
It was chosen because of its simplicity, widespread adoption, and reliability for standard cryptographic operations — making it ideal for a secure MVP.  


---

## 💻 Tech Stack

- **Framework**: Next.js (React)  
- **Authentication**: NextAuth.js  
- **Database**: MongoDB  
- **ODM**: Mongoose  
- **Styling**: Tailwind CSS  
- **Client-Side Encryption**: CryptoJS  
- **Validation**: Zod  

---

## 🛡️ Security Model

The **security of MyVault** is its most important feature. Here’s how it works:

1. **Master Password**  
   - When starting a session, the user enters a master password.  
   - This password is the **only key** that can decrypt your vault.

2. **In-Browser Encryption**  
   - Data is converted to a JSON object.  
   - Encrypted with **AES** using your master password.

3. **Encrypted Transmission**  
   - Only the **ciphertext** is sent to the server.  

4. **Secure Storage**  
   - Database stores only:  
     - Account email  
     - Entry title  
     - Encrypted payload (ciphertext)  
   - Sensitive data like **passwords, URLs, notes** are *never stored in plaintext*.  

5. **In-Browser Decryption**  
   - Encrypted data is fetched from the server.  
   - Decrypted locally in the browser with the master password.  

⚠️ **Important**: This security model relies on the app being served over **HTTPS**. Without SSL/TLS, attackers could intercept or alter JavaScript code.

---

## 🔑 Cryptography Library

This MVP uses **CryptoJS** for client-side AES encryption because of its:  
- Simple API  
- Widespread adoption  
- Reliability for standard cryptographic operations  

Perfect for **rapid MVP development**.

---
## 📋 Vault Item Structure
Each saved vault entry contains:
- Title  
- Username / Email  
- Password (encrypted)  
- URL (optional)  
- Notes (optional)  

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)  
- npm or yarn  
- Running MongoDB instance (local or MongoDB Atlas)  

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Atulkhiyani0909/MyVault.git
   cd my-vault


   ```bash 
   npm install
   # or
   yarn install

   # MongoDB connection
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth.js session encryption secret
    NEXTAUTH_SECRET=your_nextauth_secret

   # Absolute app URL
   NEXTAUTH_URL=http://localhost:3000


   npm run dev
   # or
    yarn dev

<img width="1624" height="729" alt="image" src="https://github.com/user-attachments/assets/53fea864-35e9-4169-94f0-3db9ded44c1c" />

<img width="1877" height="846" alt="image" src="https://github.com/user-attachments/assets/a1d82096-3667-425f-9b6c-d100620bf7ec" />


<img width="1632" height="788" alt="image" src="https://github.com/user-attachments/assets/9c440c07-42ed-4404-95a5-ba97fd51ed09" />

**Encrypted Data In DB**
<img width="940" height="350" alt="image" src="https://github.com/user-attachments/assets/a74d4d08-6155-448e-b2a6-728f03369632" />
<img width="878" height="282" alt="image" src="https://github.com/user-attachments/assets/535ee02b-292f-4812-9eda-be75b1df4b06" />





