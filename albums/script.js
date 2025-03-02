//! Kiểm tra đăng nhập & phân quyền

// 🛑 Kiểm tra nếu user đã đăng nhập
const user = JSON.parse(localStorage.getItem("user"));
// Lấy dữ liệu từ localStorage: Khi một user đăng nhập, 
// thông tin của họ(tên đăng nhập, vai trò, v.v.) được lưu vào localStorage.
// Dữ liệu trong localStorage là kiểu chuỗi(string), 
// nên cần dùng JSON.parse() để chuyển đổi nó thành object trong JavaScript.
// Trước khi JSON.parse():
// "{"username":"admin","role":"admin"}"
// Sau khi JSON.parse():
// { username: "admin", role: "admin" }

if (!user) {
    window.location.href = "login.html"; 
    // Nếu chưa đăng nhập, chuyển về trang login
    // if (!user): Nếu không có user trong localStorage, có nghĩa là chưa đăng nhập.
    // Chuyển hướng (redirect) về login.html, yêu cầu user phải đăng nhập.
} else {
    // 🛑 Cập nhật thông tin trên navbar
    document.getElementById("user-greeting").innerText = `Xin chào, ${user.username}`;
    // Tìm phần tử HTML có id = "user-greeting".
    // Gán nội dung mới: Hiển thị "Xin chào, admin" hoặc "Xin chào, user" tùy theo user.username.
    
    // Ẩn nút login và hiển thị nút logout
    document.getElementById("login-link").classList.add("hidden");
    document.getElementById("logout-btn").classList.remove("hidden");
    // Ẩn nút "Login" bằng cách thêm class "hidden" vào phần tử có id="login-link".
    // Hiện nút "Logout" bằng cách xóa class "hidden" khỏi id = "logout-btn".
}

// Ban đầu: Cả Admin Panel và danh sách sản phẩm đều có sẵn trong HTML, 
// nhưng bị ẩn(hidden).
// Khi đăng nhập: Dựa vào role của user, JavaScript hiện hoặc ẩn khu vực phù hợp.
// Nếu là Admin: Hiện bảng quản lý sản phẩm, ẩn danh sách sản phẩm.
// Nếu là User: Hiện danh sách sản phẩm, ẩn bảng quản lý sản phẩm.

// 🛑 Kiểm tra nếu user là admin, ẩn danh sách sản phẩm, hiển thị bảng quản lý
if (user.role === "admin") {
    document.getElementById("admin-panel").classList.remove("hidden"); 
    // Hiện bảng quản lý sản phẩm
    // Bỏ class "hidden" để hiển thị khu vực quản lý sản phẩm.
    document.getElementById("product-list").classList.add("hidden"); 
    // Ẩn danh sách sản phẩm
    // Thêm class "hidden" vào product - list, làm cho danh sách sản phẩm bị ẩn đi.
} else {
    document.getElementById("product-list").classList.remove("hidden"); 
    // Hiện danh sách sản phẩm cho User
    // Nếu user không phải Admin, danh sách sản phẩm sẽ hiển thị bình thường.
}


//! Load & Render danh sách sản phẩm

let allProducts = JSON.parse(localStorage.getItem("products")) || []; // Lưu danh sách sản phẩm gốc

// Load dữ liệu từ products.json
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const { Popular } = await response.json();

        let storedProducts = JSON.parse(localStorage.getItem("products")) || [];

        // 🔹 Kiểm tra và cập nhật dữ liệu mới vào localStorage
        if (storedProducts.length === 0) {
            localStorage.setItem("products", JSON.stringify(Popular));
            allProducts = Popular;
        } else {
            // 🛑 Gộp dữ liệu tránh trùng lặp theo `nameProduct`
            let mergedProducts = [...new Map([...storedProducts, ...Popular].map(item => [item.nameProduct, item])).values()];
            localStorage.setItem("products", JSON.stringify(mergedProducts));
            allProducts = mergedProducts;
        }

        renderAdminProducts(); // Cập nhật bảng quản lý sản phẩm của admin
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

// 🔹 Hiển thị danh sách sản phẩm của Admin
function renderAdminProducts() {
    const productTable = document.getElementById("product-table");
    productTable.innerHTML = ""; 

    allProducts.forEach((product, index) => {
        productTable.innerHTML += `
            <tr class="bg-gray-800 text-white w-full max-w-full">
                <td class="p-4">${index + 1}</td>
                <td class="p-4">${product.nameProduct}</td>
                <td class="p-4">${product.releaseDate || 'N/A'}</td>
                <td class="p-4">${product.album || 'N/A'}</td>
                <td class="p-4">${product.time || 'N/A'}</td>
                <td class="p-4 flex gap-2">
                    <button onclick="editProduct(${index})" class="bg-yellow-500 text-white px-4 py-2 rounded-lg">Sửa</button>
                    <button onclick="deleteProduct(${index})" class="bg-red-500 text-white px-4 py-2 rounded-lg">Xóa</button>
                </td>
            </tr>
        `;
    });
}

// Gọi hàm khi trang được load
window.onload = loadProducts;
