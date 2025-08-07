import { useState } from "react";
import { flattenObject } from "../utils/helpers";



export default function FilterAction(props) {
    const { initialMetadata, onFilterChange, filterData} = props;
    const [conditions, setConditions] = useState(filterData || []);
    const conditonArray = ["EQUALS", "GREATER_THAN", "LESS_THAN", "CONTAINS", "NOT_EQUAL"]

    const handleConditionChange = (index, fieldName, value) => {
        const newCondition = conditions.map((condn,idx)=> (idx==index ? {...condn, [fieldName]:value}:condn));
        setConditions(newCondition);

        onFilterChange(newCondition)

    }
    const handleAddCondition = () => {
        setConditions(prevCondition => [...prevCondition, { field: '', condition: 'EQUALS', value: '' }]);
    }

    const handleDeleteCondition = (index) => {
        setConditions(prevCondition => prevCondition.filter((condn, idx) => idx != index));
    }

    return (<div>
        <div className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <h4 className="font-semibold text-slate-600 mb-2">Filter Conditions</h4>
            <p className="text-sm text-slate-500 mb-4">
                All conditions are met then trigger will proceed.
            </p>

            <div className="space-y-3">
                {conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">

                        <select
                            value={condition.field}
                            onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                            className="p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        >
                            <option value="" disabled>Select field...</option>
                            {initialMetadata && Object.keys(flattenObject(initialMetadata,'')).map((metadataKey)=> (
                                <option value={metadataKey} key={metadataKey}>{metadataKey}</option>
                            ))}
                        </select>

                        <select
                            value={condition.condition}
                            onChange={(e) => handleConditionChange(index, 'condition', e.target.value)}
                            className="p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        >
                            {conditonArray.map((conditionType) => (
                                <option value={conditionType} key={conditionType}>{conditionType.replace('_', ' ')}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Enter value"
                            onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                            value={condition.value}
                            className="p-2 border border-slate-300 rounded-md flex-grow focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />

                        <button
                            onClick={() => handleDeleteCondition(index)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
                            title="Delete Condition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={handleAddCondition}
                className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200"
            >
                + Add AND Condition
            </button>
        </div>
    </div>)
}