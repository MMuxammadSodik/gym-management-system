import api from "./api";

const BASE_URL = "/api/staff";

const staffService = {

    getAll: async () => {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    create: async (staff) => {
        const response = await api.post(BASE_URL, staff);
        return response.data;
    },

    update: async (id, staff) => {
        const response = await api.put(`${BASE_URL}/${id}`, staff);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`${BASE_URL}/${id}`);
    },

};

export default staffService;
