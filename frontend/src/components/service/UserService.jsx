import axiosInstance from "./axiosInstance";

class UserService {
  static async login(email, password) {
    const response = await axiosInstance.post(`/auth/login`, { email, password });
    return response.data;
  }

  static async register(userData) {
    const response = await axiosInstance.post(`/auth/register`, userData);
    return response.data;
  }

  static async getAllUsers() {
    const response = await axiosInstance.get(`/admin/get-all-users`);
    return response.data;
  }

  static async getYourProfile() {
    const response = await axiosInstance.get(`/adminuser/get-profile`);
    return response.data;
  }

  static async getUserById(userId) {
    const response = await axiosInstance.get(`/admin/get-users/${userId}`);
    return response.data;
  }

  static async deleteUser(userId) {
    const response = await axiosInstance.delete(`/admin/delete/${userId}`);
    return response.data;
  }

  static async updateUser(userId, userData) {
    const response = await axiosInstance.put(`/admin/update/${userId}`, userData);
    return response.data;
  }

  // AUTHENTICATION CHECKER

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("storage")); // 🔥 Thông báo cập nhật UI
  }

  static isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  static isAdmin() {
    return localStorage.getItem("role") === "ADMIN";
  }

  static isUser() {
    return localStorage.getItem("role") === "USER";
  }

  static adminOnly() {
    return this.isAuthenticated() && this.isAdmin();
  }
}

export default UserService;
