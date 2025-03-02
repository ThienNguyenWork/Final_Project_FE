//! Kiểm tra đăng nhập & phân quyền

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html"; 
} else {
    document.getElementById("user-greeting").innerText = `Xin chào, ${user.username}`;

    document.getElementById("login-link").classList.add("hidden");
    document.getElementById("logout-btn").classList.remove("hidden");

    // Kiểm tra quyền và hiển thị nội dung phù hợp
    if (user.role === "admin") {
        document.getElementById("admin-panel").classList.remove("hidden"); 
        document.getElementById("popular").classList.add("hidden"); 
    } else {
        document.getElementById("admin-panel").classList.add("hidden"); 
        document.getElementById("popular").classList.remove("hidden"); 
    }
}

//! Load & Render danh sách sản phẩm

let allProducts = JSON.parse(localStorage.getItem("products")) || [];

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const { Popular } = await response.json();

        let storedProducts = JSON.parse(localStorage.getItem("products")) || [];

        if (storedProducts.length === 0) {
            localStorage.setItem("products", JSON.stringify(Popular));
            allProducts = Popular;
        } else {
            let mergedProducts = [...new Map([...storedProducts, ...Popular].map(item => [item.nameProduct, item])).values()];
            localStorage.setItem("products", JSON.stringify(mergedProducts));
            allProducts = mergedProducts;
        }

        if (user.role === "admin") {
            renderAdminProducts();
        } else {
            const container = document.getElementById("popular");
            renderPopular(container, Popular);
        }

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

function renderPopular(container, Popular) {
    container.innerHTML = Popular.map(song => `
        <div class="bg-gray-900 p-4 ml-5 rounded-xl shadow-lg hover:bg-[#1a1d29] transition">
            <div class="hidden lg:grid grid-cols-12 items-center gap-4">
                <div class="flex justify-content col-span-1">
                    <span class="text-white font-bold text-xl">#${song.rank}</span>
                </div>
                <div class="col-span-3 flex items-center gap-4">
                    <img class="w-14 h-14 rounded-lg object-cover" src="${song.imageLink}" alt="${song.nameProduct}" />
                    <div>
                        <h2 class="text-base text-white font-semibold leading-snug">${song.nameProduct}</h2>
                        <p class="text-xs text-gray-400">${song.nameArtist}</p>
                    </div>
                </div>
                <div class="col-span-2 text-center">
                    <span class="text-sm text-gray-400">${song.releaseDate}</span>
                </div>
                <div class="col-span-4 truncate text-center">
                    <span class="text-sm text-gray-400">${song.album || 'N/A'}</span>
                </div>
                <div class="col-span-1 text-center">
                    <i class="fa-regular fa-heart text-[#ee10b0] cursor-pointer hover:scale-110 transition-transform"></i>
                </div>
                <div class="col-span-1 text-center">
                    <span class="text-sm text-gray-400">${song.time}</span>
                </div>
            </div>
            <div class="lg:hidden flex flex-col gap-3">
                <div class="flex gap-4 items-center">
                    <img class="w-16 h-16 rounded-lg object-cover" src="${song.imageLink}" alt="${song.nameProduct}" />
                    <div>
                        <h2 class="text-lg text-white font-semibold">${song.nameProduct}</h2>
                        <p class="text-sm text-gray-400">${song.nameArtist}</p>
                    </div>
                </div>
                <div class="flex justify-between text-gray-400 text-sm">
                    <span>#${song.rank}</span>
                    <span>${song.releaseDate}</span>
                    <span>${song.album || 'N/A'}</span>
                    <span>${song.time}</span>
                </div>
                <div class="text-right">
                    <i class="fa-regular fa-heart text-[#ee10b0] cursor-pointer hover:scale-110 transition-transform"></i>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAdminProducts() {
    const productTable = document.getElementById("product-table");
    productTable.innerHTML = allProducts.map((product, index) => `
        <tr class="bg-gray-800 text-white">
            <td>${index + 1}</td>
            <td>${product.nameProduct}</td>
            <td>${product.releaseDate || 'N/A'}</td>
            <td>${product.album || 'N/A'}</td>
            <td>${product.time || 'N/A'}</td>
            <td>
                <button onclick="editProduct(${index})" class="bg-yellow-500 text-white px-4 py-2 rounded-lg">Sửa</button>
                <button onclick="deleteProduct(${index})" class="bg-red-500 text-white px-4 py-2 rounded-lg">Xóa</button>
            </td>
        </tr>
    `).join('');
}
// 🔹 Thêm / Sửa sản phẩm
function saveProduct() {
    const id = document.getElementById("edit-id").value;
    const rank = document.getElementById("product-rank").value;
    const name = document.getElementById("product-name").value;
    const releaseDate = document.getElementById("product-date").value;
    const album = document.getElementById("product-albums").value;
    const time = document.getElementById("product-time").value;

    if (!name || !releaseDate || !album || !time) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const product = { nameProduct: name, rank, releaseDate, album, time };

    id ? allProducts[id] = product : allProducts.push(product);

    localStorage.setItem("products", JSON.stringify(allProducts));
    renderAdminProducts();
    renderPopular(document.getElementById("popular"), allProducts);
}
// 🔹 Xóa sản phẩm
function deleteProduct(index) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        // Hiển thị hộp thoại xác nhận xóa.
        // Nếu người dùng chọn OK, tiếp tục xóa sản phẩm.
        allProducts.splice(index, 1);
        // splice(index, 1): Xóa sản phẩm tại vị trí index khỏi mảng allProducts.
        // Trước khi xóa
        // [
        // { "nameProduct": "iPhone 14", "price": "$1200" },
        // { "nameProduct": "Samsung Galaxy", "price": "$800" }
        // ]
        // Sau khi xóa
        // [{ "nameProduct": "Samsung Galaxy", "price": "$800" }]

        localStorage.setItem("products", JSON.stringify(allProducts));
        // Lưu danh sách allProducts mới vào localStorage để cập nhật dữ liệu.
        renderAdminProducts();
        renderPopular();
        // renderAdminProducts(): Cập nhật bảng quản lý sản phẩm Admin.
        // renderProducts() : Cập nhật danh sách sản phẩm trên trang chính.
    }
}


// 🔹 Chỉnh sửa sản phẩm
function editProduct(index) {
    const product = allProducts[index];

    // Gán index vào ô edit-id (chuyển thành dạng số để tránh lỗi kiểu dữ liệu)
    document.getElementById("edit-id").value = index;

    // Kiểm tra và điền dữ liệu sản phẩm vào form
    document.getElementById("product-rank").value = product.nameProduct || "";
    document.getElementById("product-name").value = product.nameProduct || "";
    document.getElementById("product-date").value = product.releaseDate || "";
    document.getElementById("product-albums").value = product.album || "";
    document.getElementById("product-time").value = product.time || "";

    console.log("Đang chỉnh sửa sản phẩm:", product);
}
function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login/";
}

window.onload = loadProducts;