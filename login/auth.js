// 🛑 Hàm kiểm tra đăng nhập
function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    // 🔍 Danh sách tài khoản mẫu
    const users = [
        { username: "admin", password: "123", role: "admin" },
        { username: "user", password: "123", role: "user" },
        { username: "artist", password: "123", role: "artist" } // 🎨 Thêm role artist
    ];

    // 🔎 Kiểm tra thông tin đăng nhập
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // ✅ Lưu vào localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // 📌 Điều hướng theo vai trò (role)
        if (user.role === "admin") {
            window.location.href = "/albums"; // Admin vào trang albums
        } else if (user.role === "artist") {
            window.location.href = "/discover"; // Artist vào trang dashboard riêng
        } else {
            window.location.href = "/home1"; // User vào trang home1
        }
    } else {
        // ❌ Hiển thị lỗi
        errorMsg.classList.remove("hidden");
    }
}

// 🧰 Kiểm tra quyền truy cập khi tải trang
const storedUser = JSON.parse(localStorage.getItem("user"));

// 🔹 Nếu chưa đăng nhập và không phải trang login thì chuyển hướng về login (chỉ 1 lần)
if (!storedUser && window.location.pathname !== "/login" && !sessionStorage.getItem("redirected")) {
    sessionStorage.setItem("redirected", "true"); // Đánh dấu đã chuyển hướng
    window.location.href = "/login";
}

// 🔹 Điều hướng lại nếu đã đăng nhập mà ở trang login
if (storedUser && window.location.pathname === "/login") {
    if (storedUser.role === "admin") {
        window.location.href = "/albums";
    } else if (storedUser.role === "artist") {
        window.location.href = "/discover";
    } else {
        window.location.href = "/home1";
    }
}