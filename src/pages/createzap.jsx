
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Action from "../components/action";

import { useNavigate, useParams } from "react-router-dom";
import ScheduleTrigger from "../components/scheduleTrigger";
import WebhookTrigger from "../components/webhookTrigger";
import { fetchSetupData, fetchZapById, initializeZap, publishZap, updateZap } from "../utils/apiService";
import { useWebhookPolling } from "../utils/webhookPolling";
const HOOKS_URL = import.meta.env.VITE_HOOKS_URL;
console.log(HOOKS_URL);

export default function CreateZap() {
    const navigate = useNavigate();

    const { zapId: paramZapId } = useParams();
    const isEditMode = Boolean(paramZapId);



    const [availableTriggers, setAvailableTriggers] = useState([]);
    const [availableActions, setAvailableActions] = useState([]);
    const [selectedTriggerID, setSelectedTriggerID] = useState("");
    const [actions, setActions] = useState([]);
    const [zapId, setZapId] = useState(paramZapId || null);
    const [webhookUrl, setWebhookUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTriggerType, setSelectedTriggerType] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [initialSchedule, setInitialSchedule] = useState(null); 
    const [filterData, setFilterData] = useState({});

    const { metadata: triggerMetadata, isPolling, error: pollingError, startPolling, setMetadata } = useWebhookPolling(zapId);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                const { availableTriggers, availableActions } = await fetchSetupData();
                setAvailableTriggers(availableTriggers);
                setAvailableActions(availableActions);

                if (isEditMode && paramZapId) {
                    const zapRes = await fetchZapById(paramZapId);
                    const zapData = zapRes.data;
                    if (zapData.trigger) {
                        const trigger = availableTriggers.find(t => t.id === zapData.trigger.availableTriggerId);
                        setSelectedTriggerID(trigger.id);
                        setSelectedTriggerType(trigger.name.toLowerCase().includes('schedule') ? 'SCHEDULE' : 'WEBHOOK');
                        setMetadata(zapData.trigger.metadata);
                        if (zapData.trigger.schedule) {
                            setInitialSchedule(zapData.trigger.schedule);
                            setSchedule(zapData.trigger.schedule);
                        }

                    }
                    if (zapData.actions.length > 0) {

                        const newActions = [];
                        const newFilter = {};
                        for (const action of zapData.actions) {
                            const parentActionId = uuidv4();
                            newActions.push({
                                ...action,
                                parentActionId,
                                actionId: action.availableActionId
                            })
                            if (action.filter && action.filter.conditions) {
                                newFilter[parentActionId] = action.filter.conditions;
                            }
                        }
                        setActions(newActions);
                        setFilterData(newFilter);
                    }
                    const { userId } = zapData;
                    setWebhookUrl(`${HOOKS_URL}/catch/${userId}/${paramZapId}`);
                }
            } catch (err) {
                console.error("Failed to fetch initial data", err);
                setError("Could not load necessary data. Please refresh the page.");
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();

    }, [isEditMode, paramZapId, setMetadata]);

    useEffect(() => {
        if (zapId && webhookUrl) {
            startPolling();
        }
    }, [zapId, startPolling])


    const handleTriggerSelect = (e) => {
        const newTriggerId = e.target.value;
        const trigger = availableTriggers.find(t => t.id === newTriggerId);
        if (trigger) {
            setSelectedTriggerID(trigger.id);
            setSelectedTriggerType(trigger.name.toLowerCase().includes('schedule') ? 'SCHEDULE' : 'WEBHOOK');
        }
        setZapId(null);
        setWebhookUrl(null);
        setSchedule(null);
    };

    const handleInitiateWebhook = async () => {
        if (!selectedTriggerID) return;
        try {
            const res = await initializeZap({ triggerId: selectedTriggerID });
            setWebhookUrl(res.data.webHookUrl);
            setZapId(res.data.zapId);
        } catch (err) {
            alert("Failed to generate webhook URL.");
        }
    };

    const handlePublishZap = async () => {
        const isReadyToPublish = selectedTriggerID && actions.length > 0 && (selectedTriggerType === 'SCHEDULE' || triggerMetadata);
        if (!isReadyToPublish) {
            alert("Please complete all steps before publishing.");
            return;
        }

        try {
            const triggerPayload = {
                availableTriggerId: selectedTriggerID,
                metadata: triggerMetadata,
                schedule: selectedTriggerType === 'SCHEDULE' ? schedule : null,
            };
            const actionsPayload = actions.map(action => {
                const filterConditions = filterData[action.parentActionId];
                if (filterConditions && filterConditions.length > 0) {
                    return ({ ...action, filter: { conditions: filterConditions } })
                }
                return action;
            });

            if (isEditMode) {
                await updateZap(zapId, { trigger: triggerPayload, actions: actionsPayload, active: true });
                alert("Zap updated successfully!");
            } else {
                let currentZapId = zapId;
                if (selectedTriggerType === 'SCHEDULE' && !zapId) {

                    const res = await initializeZap({ triggerId: selectedTriggerID, schedule: schedule });
                    currentZapId = res.data.zapId;
                }
                await publishZap({ zapId: currentZapId, trigger: triggerPayload, actions: actionsPayload, active: true });
                alert("Zap published successfully!");
            }
            navigate("/dashboard");
        } catch (err) {
            console.error("Error publishing zap", err);
            alert("Failed to publish zap. Please try again.");
        }
    };

    const handleAddAction = () =>
        setActions(prev => [...prev, { parentActionId: uuidv4(), actionId: null, metadata: { to: "", body: "" }, sortingOrder: prev.length }]);

    const handleActionDelete = (parentActionId) =>
        setActions(prev => prev.filter(action => action.parentActionId !== parentActionId));

    const handleMetadataChange = (parentActionId, newMetadata) =>
        setActions(prev => prev.map(action => action.parentActionId === parentActionId ? { ...action, metadata: newMetadata } : action));

    const handleActionSelect = (parentActionId, actionId) =>
        setActions(prev => prev.map(action => action.parentActionId === parentActionId ? { ...action, actionId } : action));

    const onFilterChange = (parentActionId, condition) => {
        setFilterData(prevCond => ({ ...prevCond, [parentActionId]: condition }));
    }
    if (isLoading) return <div className="text-center p-10">Loading configuration...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-white shadow-xl font-sans">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">{isEditMode ? 'Edit Zap' : 'Create a New Zap'}</h2>
            </div>
            <div className="space-y-8">
                {/* Trigger select */}
                <div className="flex gap-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white font-bold">1</div>
                    <div className="flex-1 space-y-4 pt-1">
                        <h3 className="text-lg font-semibold text-slate-700">Select a Trigger</h3>
                        <select id="trigger-select" className="w-full p-3 border border-slate-300 rounded-lg" value={selectedTriggerID} onChange={handleTriggerSelect}>
                            <option value="" disabled>Select a trigger...</option>
                            {availableTriggers.map(trigger => (
                                <option key={trigger.id} value={trigger.id}>{trigger.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {(selectedTriggerID && selectedTriggerType.toLowerCase() === 'webhook') && (
                    <WebhookTrigger
                        onZapInit={handleInitiateWebhook}
                        webhookUrl={webhookUrl}
                        isPolling={isPolling}
                        pollingError={pollingError}
                        triggerMetadata={triggerMetadata}
                        startPolling={startPolling}
                        isEditMode={isEditMode}
                    />
                )}
                {selectedTriggerType === 'SCHEDULE' && (
                    <ScheduleTrigger
                        onScheduleChange={setSchedule}
                        initialSchedule={initialSchedule}
                    />
                )}

                {/* Add Actions */}
                <div className="flex gap-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white font-bold">3</div>
                    <div className="flex-1 space-y-4 pt-1">
                        {actions.map((action, index) => (
                            <Action
                                key={action.parentActionId}
                                index={index}
                                availableActions={availableActions}
                                parentAction={action}
                                onSelect={handleActionSelect}
                                onDelete={handleActionDelete}
                                onMetadataChange={handleMetadataChange}
                                initialMetadata={triggerMetadata}
                                filterData={filterData[action.parentActionId]}
                                onFilterChange={onFilterChange}
                            />

                        ))}
                    </div>

                </div>
                <button
                    onClick={handleAddAction}
                    className="w-full text-center mt-2 px-4 py-3 border-2 border-dashed border-slate-300 text-slate-500 font-semibold rounded-lg hover:border-indigo-500 hover:text-indigo-500 transition">
                    + Add Action
                </button>

                {/* Publish */}
                <div className="pt-6 border-t border-slate-200 text-right">
                    <button
                        onClick={handlePublishZap}
                        disabled={!selectedTriggerID || actions.length === 0 || (selectedTriggerType === 'WEBHOOK' && !triggerMetadata)}
                        className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg"
                    >
                        {isEditMode ? 'Update Zap' : 'Publish Zap'}
                    </button>
                </div>
            </div>
        </div>
    );
}