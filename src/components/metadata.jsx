import React from 'react';

export default function Metadata({ metadata, level = 0 }) {
    if (!metadata || typeof metadata !== 'object' || Object.keys(metadata).length === 0) {
        return null; 
    }

    const paddingLeftClass = `pl-${level * 4}`;

    return (
        <div className={`flex flex-col ${paddingLeftClass} ${level > 0 ? 'mt-2' : ''}`}>
            {Object.entries(metadata).map(([key, value]) => {
                const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
                const isArray = Array.isArray(value);

                return (
                    <div key={key} className="mb-1">
                        {isObject ? (
                            <div>
                                <p className="text-gray-700 font-semibold capitalize text-base">
                                    {key}:
                                </p>
                                <Metadata metadata={value} level={level + 1} />
                            </div>
                        ) : (
                            <div className="flex items-baseline space-x-1">
                                <p className="text-gray-600 font-medium">{key}:</p>
                                <p className="text-gray-800 font-semibold">{String(value)}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}