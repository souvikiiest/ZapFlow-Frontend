
import { useCallback, useEffect, useRef, useState } from "react";
import { pollForMetadata } from "../utils/apiService";


export const useWebhookPolling = (zapId) => {
    const [metadata, setMetadata] = useState(null);
    const [isPolling, setIsPolling] = useState(false);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const startPolling = useCallback(async () => {
        if (!zapId) return;
        console.log("polling start")
        setIsPolling(true);
        setError(null);
        setMetadata(null);

        intervalRef.current = setInterval(async () => {
           
                const res = await pollForMetadata(zapId);
                if (res.status == 200 && res.data.metadata) {
                    clearInterval(intervalRef.current);
                    setMetadata(res.data.metadata);
                    setIsPolling(false);

                }
            
        }, 3000)
    }, [zapId])


    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, []);

    return { metadata, isPolling, error , startPolling, setMetadata};
};