import axios from "axios";

axios.defaults.baseURL = "https://agro-mapping.onrender.com";

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
export default axios;