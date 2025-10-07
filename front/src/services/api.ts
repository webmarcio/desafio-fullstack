
const API_URL = 'http://localhost:8000/api';

async function request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na requisição');
    }

    return response.json();
}

export const getPlans = () => {
    return request('/plans');
};

export const getUser = () => {
    return request('/user');
};

export const subscribeToPlan = (planId: number) => {
    return request('/contracts', {
        method: 'POST',
        body: JSON.stringify({ plan_id: planId }),
    });
};

export const changePlan = (planId: number) => {
    return request('/contracts/change-plan', {
        method: 'POST',
        body: JSON.stringify({ plan_id: planId }),
    });
};

export const getHistory = () => {
    return request('/contracts/history');
};
