import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { deleteZap, fetchAllZaps, toggleActiveZapStatus } from '../utils/apiService';

export default function Dashboard() {

  const [allzap, setAllzap] = useState([])
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    const fetchZaps = async () => {
      try {
        const response = await fetchAllZaps();
        setAllzap(response.data);
      } catch (err) {
        console.error("Failed to fetch zaps:", err);
        alert("Could not load your zaps. Please try refreshing the page.");
      }
    };

    fetchZaps();

  }, [token, navigate])


  const handleDelete = async (zapIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this zap?")) {
      try {
        const response = await deleteZap(zapIdToDelete);
        if (response.status === 200) {
          setAllzap(prevZaps => prevZaps.filter(zap => zap.id !== zapIdToDelete));
        } else {
          alert("Failed to delete the zap.");
        }
      }
      catch (err) {
        console.error("Error deleting zap:", err);
        alert("An error occurred while deleting the zap.");
      }
    }
  };

  const handleToggleActive = async (zap) => {
    const newStatus = !zap.active;

    const payload = {
      active: newStatus,
      trigger: zap.trigger,
      actions: zap.actions
    };

    try {
      const response = await toggleActiveZapStatus(zap.id, payload);
      if (response.status === 200) {
        setAllzap(prevZaps =>
          prevZaps.map(currentZap => currentZap.id === zap.id
            ? { ...currentZap, active: newStatus }
            : currentZap
          )
        );
      } else {
        alert("Failed to update the zap's status on the server.");
      }
    } catch (err) {
      console.error("Error toggling zap status:", err);
      alert("An error occurred. Please try again.");
    }
  };





  return (<div className="min-h-screen bg-gray-100 p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Your Zaps</h1>
      <div className="space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/create-zap")}
        >
          + Create Zap
        </button>
      </div>
    </div>

    {allzap.length == 0 ? (
      <div>No zap created</div>
    ) : (

      <div className="grid gap-4">
        {allzap.map((zap) => (
          <div
            key={zap.id}
            className="bg-white p-4 shadow rounded border border-gray-200 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">Zap ID: {zap.id}</h2>
              <p className="text-sm text-gray-600">Trigger: {zap.trigger?.availableTrigger.name}</p>
              <p className="text-sm text-gray-600">Actions: {zap.actions?.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className={`text-sm font-medium ${zap.active ? 'text-green-600' : 'text-gray-500'}`}>
                  {zap.active ? 'On' : 'Off'}
                </span>
                <button
                  onClick={() => handleToggleActive(zap)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 ml-2 transition-colors focus:outline-none ${zap.active ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${zap.active ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
              <button
                onClick={() => navigate(`/zaps/history/${zap.id}`)}
                className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                History
              </button>
              <button
                onClick={() => navigate(`/zaps/edit/${zap.id}`)}
                className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(zap.id)}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  )
}