import { UseAuth } from "../context/authContext";


export default function ShowUserDetail({ user=null}) {
  const {logout} = UseAuth();
    return (
        <div 
        className="absolute top-14 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="p-4 border-b border-gray-200">
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="p-2">
          <a 
            href="/dashboard" 
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            Dashboard
          </a>
          <button 
            onClick={logout}
            className="block w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      </div>
    )
}