import { envDefaults } from "../../envDefaults";
import { apiUrls } from "../constants/apiUrls";

// General fetch function that can be reused anywhere
export const generalFetch = async (
    url: string,
    method: string = 'GET',
    data?: unknown,
    headers: Record<string, string> = {}
) => {
    const isFormData = data instanceof FormData;

    const config: RequestInit = {
        method,
        headers: isFormData ? headers : {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (method !== 'GET' && data) {
        config.body = isFormData ? data as FormData : JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const apiService = {
    uploadPdf: async (file: File) => {
        const formData = new FormData();
        formData.append('pdf', file);
        
        return await generalFetch( `${envDefaults.baseUrl}${apiUrls.uploadPdf}`, 'POST', formData);
    },
    
    // Example of using the general fetch function
    getData: async (endpoint: string) => {
        return await generalFetch(`${envDefaults.baseUrl}${endpoint}`, 'GET');
    },
    
    postData: async (endpoint: string, data: unknown) => {
        return await generalFetch(`${envDefaults.baseUrl}${endpoint}`, 'POST', data);
    },
    
    putData: async (endpoint: string, data: unknown) => {
        return await generalFetch(`${envDefaults.baseUrl}${endpoint}`, 'PUT', data);
    },
    
    deleteData: async (endpoint: string) => {
        return await generalFetch(`${envDefaults.baseUrl}${endpoint}`, 'DELETE');
    },
}