import axiosInstance from "./axiosInstance";

class UserService {
  static BASE_URL = "http://localhost:1010"

  static async login(email, password) {
    const response = await axiosInstance.post(`${UserService.BASE_URL}/auth/login`, { email, password })
    return response.data;
  }

  static async register(userData, token) {
    const response = await axiosInstance.post(`${UserService.BASE_URL}/auth/register`, userData, 
      {
        headers: {Authorization: `Bearer ${token}`}
      })
    return response.data;
  }

  static async getAllUsers(token) {
    const response = await axiosInstance.get(`${UserService.BASE_URL}/admin/get-all-users`,
      {
        headers: {Authorization: `Bearer ${token}`}
      })
    return response.data;
  }

  static async getYourProfile(token) {
    const response = await axiosInstance.get(`${UserService.BASE_URL}/adminuser/get-profile`,
      {
        headers: {Authorization: `Bearer ${token}`}
      })
    return response.data;
  }

  static async getUserById(userId, token) {
    const response = await axiosInstance.get(`${UserService.BASE_URL}/admin/get-users/${userId}`,
      {
        headers: {Authorization: `Bearer ${token}`}
      })
    return response.data;
  }

  static async deleteUser(userId, token) {
    const response = await axiosInstance.delete(`${UserService.BASE_URL}/admin/delete/${userId}`,
      {
        headers: {Authorization: `Bearer ${token}`}
      })
    return response.data;
  }

  static async updateUser(userId, userData, token) {
    const response = await axiosInstance.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData,
      {
        headers: {Authorization: `Bearer ${token}`}
      })
    return response.data;
  }

  // AUTHENTICATION CHECKER

  static logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('role')
    window.dispatchEvent(new Event("storage")); // 🔥 Thông báo cập nhật UI
  }

  static isAuthenticated() {
    const token = localStorage.getItem('token')
    return !!token
  }

  static isAdmin() {
    const role = localStorage.getItem('role')
    return role === 'ADMIN'
  }

  static isUser() {
    const role = localStorage.getItem('role')
    return role === 'USER'
  }

  static adminOnly() {
    return this.isAuthenticated() && this.isAdmin();
  }
}

export default UserService;