import { useState } from "react";
import { UseAuth } from "../context/authContext";
import ShowUserDetail from "./showUserDetails";

export default function Header() {

    const [showDetails, setShowDetails] = useState(false);
    const {userData, isLoggedIn} = UseAuth();
    
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="/" className="text-2xl font-bold text-indigo-600">
                    ZapFlow
                </a>

                <nav className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <div className="relative flex items-center space-x-4">
                            <a href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">Dashboard</a>
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                id="profile-button"
                                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            {showDetails && <ShowUserDetail user={userData}/>}
                        </div>
                    ) : (
                        <div id="logged-out-nav" className="md:flex items-center space-x-2">
                            <a href="/signin" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Log In</a>
                            <a href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors">Sign Up</a>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};