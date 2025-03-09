//! Kiểm tra đăng nhập & phân quyền

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
} else {
    document.getElementById("user-greeting").innerText = `Xin chào, ${user.username}`;

    document.getElementById("login-link").classList.add("hidden");
    document.getElementById("logout-btn").classList.remove("hidden");

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
        // First, get all stored products
        let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        
        // Load products from JSON file
        const response = await fetch('products.json');
        const { Popular } = await response.json();

        // Merge products, giving priority to stored products
        let mergedProducts = [...storedProducts];
        
        // Only add products from Popular that don't exist in stored products
        Popular.forEach(popularProduct => {
            if (!mergedProducts.some(stored => stored.nameProduct === popularProduct.nameProduct)) {
                mergedProducts.push(popularProduct);
            }
        });

        // Update localStorage and allProducts
        localStorage.setItem("products", JSON.stringify(mergedProducts));
        allProducts = mergedProducts;

        // Render based on user role
        if (user.role === "admin") {
            renderAdminProducts();
        } else {
            const container = document.getElementById("popular");
            renderPopular(container, allProducts); // This should now show all products
        }
        
        console.log("Total products loaded:", mergedProducts.length); // Debug line
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

function renderPopular(container, products) {
    container.innerHTML = products.map((song, index) => `
        <div class="bg-gray-900 p-4 ml-5 rounded-xl shadow-lg hover:bg-[#1b638c] hover:border-2 hover:border-[#99e1ec] hover:shadow-[0_0_15px_#0e9eef] transition">
            <div class="hidden lg:grid grid-cols-12 items-center gap-4">
                <div class="flex justify-content col-span-1">
                    <span class="text-white font-bold text-xl">#${index + 1}</span>
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
        </div>
    `).join('');
}

function renderAdminProducts() {
    const productTable = document.getElementById("product-table");
    productTable.innerHTML = allProducts.map((product, index) => `
        <tr class="bg-gray-800 text-white">
            <td>${index + 1}</td>
            <td>${product.imageLink}</td>
            <td>${product.nameProduct}</td>
            <td>${product.nameArtist}</td>
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

function saveProduct() {
    try {
        const id = document.getElementById("edit-id").value;
        const rank = document.getElementById("product-rank").value;
        const imageLink = document.getElementById("product-image").value;
        const nameProduct = document.getElementById("product-name").value;
        const nameArtist = document.getElementById("product-artist").value;
        const releaseDate = document.getElementById("product-date").value;
        const album = document.getElementById("product-albums").value;
        const time = document.getElementById("product-time").value;

        if (!rank || !imageLink || !nameProduct || !nameArtist || !releaseDate || !album || !time) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const product = { nameProduct, rank, imageLink, nameArtist, releaseDate, album, time };

        console.log("Saving product:", product);

        if (id) {
            allProducts[id] = product;
        } else {
            allProducts.push(product);
        }
       
        localStorage.setItem("products", JSON.stringify(allProducts));
        renderAdminProducts();
        renderPopular(document.getElementById("popular"), allProducts);
        clearForm();
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Có lỗi xảy ra khi lưu sản phẩm!");
    }
}
function clearForm() {
    document.getElementById("edit-id").value = "";
    document.getElementById("product-rank").value = "";
    document.getElementById("product-image").value = "";
    document.getElementById("product-name").value = "";
    document.getElementById("product-artist").value = "";
    document.getElementById("product-date").value = "";
    document.getElementById("product-albums").value = "";
    document.getElementById("product-time").value = "";
}
function deleteProduct(index) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        allProducts.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(allProducts));
        renderAdminProducts();
        renderPopular(document.getElementById("popular"), allProducts);
    }
}

function editProduct(index) {
    const product = allProducts[index];
    document.getElementById("edit-id").value = index;
    document.getElementById("product-rank").value = product.rank || "";
    document.getElementById("product-image").value = product.imageLink || "";
    document.getElementById("product-name").value = product.nameProduct || "";
    document.getElementById("product-artist").value = product.nameArtist || "";
    document.getElementById("product-date").value = product.releaseDate || "";
    document.getElementById("product-albums").value = product.album || "";
    document.getElementById("product-time").value = product.time || "";
}
// 🔹 Hàm tìm kiếm sản phẩm
function searchProducts() {
    const searchText = document.getElementById('search-navbar').value.toLowerCase();
    // Lấy nội dung người dùng nhập vào ô tìm kiếm(search - navbar).
    // Chuyển thành chữ thường(toLowerCase()) để tìm kiếm không phân biệt chữ hoa / chữ thường.
    // Ví dụ:
    // Người dùng nhập: "iphone".
    // Nếu sản phẩm trong danh sách là "iPhone 14":
    // "iPhone 14".toLowerCase() → "iphone 14".
    // "iphone 14".includes("iphone") → Kết quả khớp.

    const filteredProducts = allProducts.filter(product =>
    // Duyệt qua toàn bộ danh sách sản phẩm (allProducts).
    // Giữ lại sản phẩm nào có nameProduct chứa từ khóa tìm kiếm.
        product.nameProduct.toLowerCase().includes(searchText)
    );
    renderPopular(document.getElementById("popular"), filteredProducts);
    // Cập nhật giao diện, chỉ hiển thị sản phẩm khớp với từ khóa.
}
// 🔹 Lắng nghe sự kiện nhập vào ô tìm kiếm
document.getElementById('search-navbar').addEventListener('input', searchProducts);
// Mỗi lần người dùng nhập chữ vào ô tìm kiếm, hàm searchProducts() sẽ được gọi.
// Tìm kiếm & cập nhật kết quả theo thời gian thực.

function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login/";
}

window.onload = loadProducts;
