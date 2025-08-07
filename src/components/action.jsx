
import { useEffect, useState } from "react";
import Email from "./email";
import FilterAction from "./filterAction";

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export default function Action(props) {
    const { parentAction, index, availableActions, onSelect, onDelete, onMetadataChange, initialMetadata, onFilterChange, filterData} = props;
    const { parentActionId, actionId } = parentAction;
    const [actionName, setActionName] = useState(null);
    useEffect(() => {
        const selected = availableActions.find((action) => action.id === actionId);
        setActionName(selected?.name.toLowerCase() || null);
    }, [actionId, availableActions]);

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl transition-all duration-300">
            {/* Action Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                <p className="font-semibold text-slate-700">Action #{index + 1}</p>
                <button 
                    onClick={() => onDelete(parentActionId)} 
                    className="text-slate-400 hover:text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
                    aria-label="Delete action"
                >
                    <TrashIcon />
                </button>
            </div>

            <div className="p-4 space-y-4">
                <select
                    className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
                    onChange={(e) => onSelect(parentActionId, e.target.value)}
                    value={actionId || ""}
                    aria-label="Select action type"
                >
                    <option value="" disabled>Choose an action...</option>
                    {availableActions.map((action) => (
                        <option key={action.id} value={action.id}>{action.name}</option>
                    ))}
                </select>
                
                {actionName === "email" && (
                    <div className="pt-2">
                         <Email
                            onChange={(newMetadata) => onMetadataChange(parentActionId, newMetadata)}
                            initialMetadata = {initialMetadata}
                            parentAction={parentAction}
                         />
                    </div>
                )}
                {actionName === "filter" && (
                    <div className="pt-2">
                        <FilterAction
                        initialMetadata = {initialMetadata}
                        onFilterChange={(conditions)=>onFilterChange(parentActionId, conditions)}
                        filterData={filterData}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}