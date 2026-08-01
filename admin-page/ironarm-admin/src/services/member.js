import api from "./api";

const BASE_URL = "/api/members";

const memberService = {

    getAll: async () => {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    create: async (member) => {
        const response = await api.post(BASE_URL, member);
        return response.data;
    },

    update: async (id, member) => {
        const response = await api.put(`${BASE_URL}/${id}`, member);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    getMembersCreatedToday: async () => {
        const response = await api.get(`${BASE_URL}/created-today`);
        return response.data;
    },

};

export default memberService;
