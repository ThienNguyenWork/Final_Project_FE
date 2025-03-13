// Hàm hiển thị toast
function showToast(message, duration = 3000) {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return; 
    const toast = document.createElement("div");
    toast.className = "bg-green-500 text-white px-4 py-2 rounded shadow-md mb-2 transition-transform transform translate-x-full";
    toast.innerText = message;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove("translate-x-full");
    }, 100);

    setTimeout(() => {
        toast.classList.add("translate-x-full");
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Hàm đăng ký
function register(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const phonenumber = document.getElementById("phonenumber").value;
    const errorMsg = document.getElementById("error-msg");
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // if (users.find(u => u.username === username)) {
    //     errorMsg.innerText = "Tên người dùng đã tồn tại!";
    //     errorMsg.classList.remove("hidden");
    // } else if (password !== confirmPassword) {
    //     errorMsg.innerText = "Mật khẩu không khớp!";
    //     errorMsg.classList.remove("hidden");
    // } else {
    //     users.push({ username, password, role: "user" });
    //     localStorage.setItem("users", JSON.stringify(users));
    //     showToast("Đăng ký thành công!");
    //     setTimeout(() => window.location.href = "login.html", 3000);
    // }
  
   // Kiểm tra xem có bỏ trống trường nào không
   if (!username || !password || !email || !phonenumber) {
    errorMsg.innerText = "Vui lòng nhập đầy đủ thông tin!";
    errorMsg.classList.remove("hidden");
    return;
}

    if (users.find(u => u.username === username)) {
        errorMsg.innerText = "Tên người dùng đã tồn tại!";
        errorMsg.classList.remove("hidden");
    } else {
        users.push({ username, password, role: "user" });
        localStorage.setItem("users", JSON.stringify(users));
        showToast("Đăng ký thành công!");
        setTimeout(() => window.location.href = "/login/index.html", 3000);
    }    
}

// Hàm đăng nhập
function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        showToast("Đăng nhập thành công!");
        setTimeout(() => window.location.href = "/login/index.html", 3000);
    } else {
        errorMsg.innerText = "Sai tài khoản hoặc mật khẩu!";
        errorMsg.classList.remove("hidden");
    }
}

// Tự động chuyển hướng nếu đã đăng nhập
if (localStorage.getItem("user")) {
    window.location.href = "index.html";
}

// Tạo tài khoản admin mặc định
(function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (!users.some(u => u.role === "admin")) {
        users.push({ username: "admin", password: "123", role: "admin" });
        localStorage.setItem("users", JSON.stringify(users));
    }
})();
