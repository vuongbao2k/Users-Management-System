import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:1010",
});

// Trạng thái refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Khi refresh xong, tiếp tục các request đang chờ
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Hàm logout
const handleLogout = () => {
  console.warn("🚪 Logging out user...");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  window.dispatchEvent(new Event("storage"));
  window.location.href = "/login"; // Chuyển hướng về trang login
};

// Interceptor thêm token vào request
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    // Kiểm tra nếu token đã hết hạn trước khi gửi request
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Giải mã JWT
      const now = Date.now() / 1000; // Thời gian hiện tại (giây)

      if (tokenPayload.exp < now) {
        console.log("⏳ Token đã hết hạn, cần refresh trước khi gửi request...");

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshResponse = await axios.post("http://localhost:1010/auth/refresh", { token: refreshToken });

            if (refreshResponse.data.token) {
              console.log("✅ Nhận token mới trước khi request:", refreshResponse.data.token);
              localStorage.setItem("token", refreshResponse.data.token);
              token = refreshResponse.data.token;
              onRefreshed(token); // Thông báo cho các request đang chờ
            } else {
              console.error("❌ Không thể refresh token, cần đăng nhập lại.");
              handleLogout();
              return Promise.reject(new Error("Token refresh failed"));
            }
          } catch (refreshError) {
            console.error("❌ Refresh token thất bại:", refreshError);
            handleLogout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // Nếu đang refresh, chờ token mới
          return new Promise((resolve) => {
            refreshSubscribers.push((newToken) => {
              config.headers["Authorization"] = `Bearer ${newToken}`;
              resolve(config);
            });
          });
        }
      }
    }

    if (token) {
      console.log("🔍 Gửi request với token:", token);
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý lỗi 403 (token hết hạn)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      console.log("🔄 Access token hết hạn, đang refresh...");
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.error("⚠️ Không tìm thấy refresh token!");
          handleLogout();
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post("http://localhost:1010/auth/refresh", {
          token: refreshToken,
        });

        console.log("✅ Nhận token mới sau lỗi 403:", refreshResponse.data.token);

        localStorage.setItem("token", refreshResponse.data.token);

        // Gán token mới vào request cũ và gửi lại
        originalRequest.headers["Authorization"] = `Bearer ${refreshResponse.data.token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token thất bại:", refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
