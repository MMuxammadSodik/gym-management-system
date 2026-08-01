import api from "./api";

const BASE_URL = "/api/products";

const productService = {

    getAll: async () => {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    create: async (product) => {
        const response = await api.post(BASE_URL, product);
        return response.data;
    },

    update: async (id, product) => {
        const response = await api.put(`${BASE_URL}/${id}`, product);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`${BASE_URL}/${id}`);
    },

};

export default productService;
