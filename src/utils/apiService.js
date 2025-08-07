
import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL
});
console.log(import.meta.env.VITE_BASE_API_URL);

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const checkLoginUser = async ()=>{
    return apiClient.post("/auth/me");
}

export const fetchSetupData = async () => {
    const [triggers, actions] = await Promise.all([
        apiClient.get("/available-triggers"),
        apiClient.get("/available-actions"),
    ]);
    return {
        availableTriggers: triggers.data,
        availableActions: actions.data,
    };
};

export const fetchZapById = async (zapId)=>{
    return  apiClient.get(`/zaps/zap/${zapId}`);
}

export const signinUserApi = async (formData) =>{
    return apiClient.post("/auth/signin", formData);
}

export const initializeZap = (payload) => {
    return apiClient.post("/zaps/init",  payload );
};

export const pollForMetadata = (zapId) => {
    return apiClient.get(`/zaps/${zapId}/metadata`);
};

export const publishZap = (payload) => {
    return apiClient.post("/zaps/", payload);
};

export const updateZap = (zapId, payload)=>{
    return apiClient.put(`/zaps/${zapId}`, payload);
}

export const fetchHistory = (zapId)=>{
    return apiClient.get(`/zaps/history/${zapId}`);
}

export const fetchAllZaps = ()=>{
    return apiClient.get("/zaps/");
}

export const deleteZap = (zapId)=>{
    return apiClient.delete(`/zaps/${zapId}`);
}

export const toggleActiveZapStatus = (zapId, payload) =>{
    return apiClient.put(`/zaps/${zapId}`, payload);
}

export const signupHandler = (formData)=>{
    return apiClient.post("/auth/signup", formData);
}