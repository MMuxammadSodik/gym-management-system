import api from "./api";

export async function login(username, password) {

    const response = await api.post("/api/auth/login", {
        username,
        password,
    });

    return response.data;
}

export function saveToken(token) {
    localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
}

export function getToken() {
    return localStorage.getItem("token");
}
export async function validateToken() {

    const response = await api.get("/api/auth/me");

    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get("/api/auth/me");
    return response.data;
}