import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RunCard from "../components/runcard";
import { UseAuth } from "../context/authContext";
import { fetchHistory } from "../utils/apiService";

export default function History() {
    const navigate = useNavigate();
    const { zapId } = useParams();
    const [zapHistory, setZapHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {isLoggedIn} = UseAuth();
    useEffect(() => {

        const fetchDetails = async () => {
            try {
                setIsLoading(true);
                const zapRes = await fetchHistory(zapId);
                setZapHistory(zapRes.data);
            } catch (err) {
                setError("Failed to load run history. Please try again.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [zapId, isLoggedIn]);

    const successRate = useMemo(()=>{
        if(!zapHistory || zapHistory.length==0){
            return 100;
        }
        const successCount = zapHistory.filter(zaps=>zaps.status=="SUCCESS").length;
        const toalRun = zapHistory.length;
        return Math.round((successCount/toalRun)*100);
    },[zapHistory])


    if (isLoading) {
        return <div className="text-center p-10">Loading history...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Run History</h1>
                <p className="text-gray-500">Zap ID: {zapId}</p>
            </div>
            <div className="mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <h3 className="font-semibold text-gray-700">Success Rate</h3>
                <p className="text-4xl font-bold text-indigo-600 mt-1">{successRate}%</p>
                <p className="text-sm text-gray-500">Based on total {zapHistory.length} runs.</p>
            </div>
            {zapHistory.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-lg shadow">
                    <p className="text-gray-600">This zap hasn't run yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {zapHistory.map(run => (
                        <RunCard key={run.id} run={run} />
                    ))}
                </div>
            )}
        </div>
    );
}