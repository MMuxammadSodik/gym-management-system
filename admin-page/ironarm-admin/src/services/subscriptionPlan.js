import api from "./api";

const BASE_URL = "/api/subscription-plans";

const subscriptionPlanService = {

    getAll: async () => {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    getAllActive: async () => {
        const response = await api.get(`${BASE_URL}/active`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    create: async (plan) => {
        const response = await api.post(BASE_URL, plan);
        return response.data;
    },

    update: async (id, plan) => {
        const response = await api.put(`${BASE_URL}/${id}`, plan);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`${BASE_URL}/${id}`);
    }

};

export default subscriptionPlanService;