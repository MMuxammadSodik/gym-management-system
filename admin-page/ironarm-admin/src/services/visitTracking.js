import api from "./api";

const BASE_URL = "/api/visit-tracking";

const visitTrackingService = {

    getByMemberId: async (memberId) => {
        const response = await api.get(`${BASE_URL}/member/${memberId}`);
        return response.data;
    },

    getStats: async (memberId) => {
        const response = await api.get(`${BASE_URL}/member/${memberId}/stats`);
        return response.data;
    },

    addVisit: async (memberId, data) => {
        const response = await api.post(`${BASE_URL}/member/${memberId}`, data);
        return response.data;
    },

    delete: async (visitId) => {
        await api.delete(`${BASE_URL}/${visitId}`);
    },

};

export default visitTrackingService;
