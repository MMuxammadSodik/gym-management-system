import api from "./api";

const singlePurchaseService = {
    getPrice: async () => {
        const response = await api.get("/api/single-purchase/price");
        return response.data;
    },

    setPrice: async (price) => {
        const response = await api.post("/api/single-purchase/price", price);
        return response.data;
    },
};

export default singlePurchaseService;
