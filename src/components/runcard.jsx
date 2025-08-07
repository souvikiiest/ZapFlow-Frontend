import { useState } from 'react';

const SuccessIcon = () => (
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
    </div>
);
const ErrorIcon = () => (
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-100 rounded-full">
        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </div>
);
const PendingIcon = () => (
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </div>
);

export default function RunCard({ run }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'SUCCESS': return <SuccessIcon />;
            case 'ERROR': return <ErrorIcon />;
            case 'PENDING': return <PendingIcon />;
            default: return <PendingIcon />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center p-4">
                {getStatusIcon(run.status)}
                <div className="ml-4 flex-grow">
                    <p className="font-semibold text-gray-800">
                        Status: <span className={`font-bold ${run.status === 'SUCCESS' ? 'text-green-600' : run.status === 'ERROR' ? 'text-red-600' : 'text-gray-600'}`}>{run.status}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Ran on: {formatDate(run.createdAt)}
                    </p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                </button>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-700 mb-2">Details</h4>
                    <dl className="text-sm space-y-2">

                        <div>
                            <div className="font-medium text-blue-700">Message:</div>
                            {(run.status === 'SUCCESS') ?
                                <div className="mt-1 p-2 bg-green-100 text-green-800 rounded font-mono">Ran Successfully</div>
                                : <div className="mt-1 p-2 bg-red-100 text-red-800 rounded font-mono">{run.errorMessage} </div>}
                        </div>

                    </dl>
                </div>
            )}
        </div>
    );
}