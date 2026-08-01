import api from "./api";

const subscriptionPlanOptionService = {

    async getAll() {

        const response =
            await api.get("/api/subscription-plan-options");

        return response.data;

    },

    async getByPlan(subscriptionPlanId) {

        const response =
            await api.get(
                `/api/subscription-plan-options/plan/${subscriptionPlanId}`
            );

        return response.data;

    },

    async getById(id) {

        const response =
            await api.get(
                `/api/subscription-plan-options/${id}`
            );

        return response.data;

    },

    async create(data) {

        const response =
            await api.post(
                "/api/subscription-plan-options",
                data
            );

        return response.data;

    },

    async update(id, data) {

        const response =
            await api.put(
                `/api/subscription-plan-options/${id}`,
                data
            );

        return response.data;

    },

    async delete(id) {

        await api.delete(
            `/api/subscription-plan-options/${id}`
        );

    }

};

export default subscriptionPlanOptionService;