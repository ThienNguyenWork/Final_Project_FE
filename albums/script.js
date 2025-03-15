//! Kiểm tra đăng nhập & phân quyền

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
} else {
    document.getElementById("user-greeting").innerText = `Xin chào, ${user.username}`;

    document.getElementById("login-link").classList.add("hidden");
    document.getElementById("logout-btn").classList.remove("hidden");

    // Kiểm tra role và cập nhật giao diện tương ứng
    if (user.role === "admin" || user.role === "artist") {
        document.getElementById("admin-panel").classList.remove("hidden");
        document.getElementById("popular").classList.add("hidden");
    } else {
        document.getElementById("admin-panel").classList.add("hidden");
        document.getElementById("popular").classList.remove("hidden");
    }
    
    if (user && (user.role === "admin" || user.role === "artist")) {
        renderAdminProducts(); // Hiển thị danh sách sản phẩm cho admin & artist
    }

    // Kiểm tra quyền và hiển thị phần "Quản Lý Sản Phẩm"
const productManagementSection = document.getElementById("product-management");

if (user.role === "artist") {
    productManagementSection.classList.remove("hidden");
} else {
    productManagementSection.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const pendingSection = document.getElementById("pending-section");

    if (user && user.role === "admin") {
        pendingSection.classList.remove("hidden"); // Hiển thị danh sách cho admin
    } else {
        pendingSection.classList.add("hidden"); // Ẩn danh sách cho artist và user khác
    }
});


}

// Load & Render danh sách sản phẩm
let allProducts = JSON.parse(localStorage.getItem("products")) || [];
async function loadProducts() {
    try {
        let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        let pendingProducts = JSON.parse(localStorage.getItem("pendingProducts")) || [];

        const response = await fetch('products.json');
        const { Popular } = await response.json();

        let mergedProducts = [...storedProducts];

        Popular.forEach(popularProduct => {
            const existingProduct = mergedProducts.find(stored => stored.nameProduct === popularProduct.nameProduct);
            if (!existingProduct) {
                mergedProducts.push(popularProduct);
            } else {
                Object.assign(existingProduct, popularProduct);
            }
        });

        localStorage.setItem("products", JSON.stringify(mergedProducts));
        allProducts = mergedProducts;

        if (user.role === "admin") {
            renderAdminProducts();
            renderPendingProducts(pendingProducts); // Hiển thị danh sách chờ duyệt
        } else if (user.role === "artist") {
            renderPendingProducts(pendingProducts.filter(p => p.createdBy === user.username));
        } else {
            renderPopular(document.getElementById("popular"), allProducts);
        }

        console.log("Tổng số sản phẩm đã tải:", mergedProducts.length);
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}


// Render danh sách bài hát
function renderPopular(container, products) {
    container.innerHTML = products.map((song, index) => `
        <div onclick="navigateToDetail(${index})" class="bg-gray-900 p-4 ml-5 rounded-xl shadow-lg hover:bg-[#1a1d29] transition cursor-pointer">
            <div class="lg:grid grid-cols-12 items-center gap-4">
                <span class="text-white font-bold text-xl">#${index + 1}</span>
                <div class="col-span-3 flex items-center gap-4">
                    <img class="w-14 h-14 rounded-lg object-cover" src="${song.imageLink}" alt="${song.nameProduct}" />
                    <div>
                        <h2 class="text-base text-white font-semibold">${song.nameProduct}</h2>
                        <p class="text-xs text-gray-400">${song.nameArtist}</p>
                    </div>
                </div>
                <div class="col-span-3 hidden lg:block">
                    <p class="text-sm text-gray-400">${song.album}</p>
                </div>
                <div class="col-span-2 hidden lg:block">
                    <p class="text-sm text-gray-400">${song.releaseDate}</p>
                </div>
                <div class="col-span-2 hidden lg:block">
                    <p class="text-sm text-gray-400">${song.time}</p>
                </div>
                
            </div>
        </div>
    `).join('');
}


// Chuyển đến trang chi tiết
function navigateToDetail(index) {
    window.location.href = `detail.html?id=${index}`;
}

//Render danh sách bài hát của admin
function renderAdminProducts() {
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];

    const productTable = document.getElementById("product-table");
    productTable.innerHTML = allProducts.map((product, index) => {
        // Kiểm tra vai trò của người dùng
        const showEditButton = user.role !== "admin"; // Ẩn nút "Sửa" nếu là admin
        return `
            <tr class="bg-gray-800 text-white">
                <td class="p-2 w-16 text-center">${index + 1}</td>
                <td class="p-2 w-24 text-center">
                    <div class="flex justify-center">
                        <img src="${product.imageLink}" alt="Hình ảnh" width="50" height="50" class="rounded-lg">
                    </div>
                </td>
                <td class="p-2 w-32 break-words">${product.nameProduct}</td>
                <td class="p-2 w-32 break-words">${product.nameArtist}</td>
                <td class="p-2 w-32 text-center">${product.releaseDate || 'N/A'}</td>
                <td class="p-2 w-48">${product.album || 'N/A'}</td>
                <td class="p-2 w-24 text-center">${product.time || 'N/A'}</td>
                <td class="p-2 text-center">
                    ${showEditButton ? `<button onclick="editProduct(${index})" class="bg-yellow-500 text-white px-4 py-2 rounded-lg">Sửa</button>` : ''}
                    <button onclick="deleteProduct(${index})" class="bg-red-500 text-white px-4 py-2 rounded-lg">Xóa</button>
                </td>
            </tr>
        `;
    }).join('');
}

//Thêm sản phẩm mới
function saveProduct() {
    try {
        const id = document.getElementById("edit-id").value;
        const imageLink = document.getElementById("product-image").value;
        const nameProduct = document.getElementById("product-name").value;
        const nameArtist = document.getElementById("product-artist").value;
        const releaseDate = document.getElementById("product-date").value;
        const album = document.getElementById("product-albums").value;
        const time = document.getElementById("product-time").value;
        const audioLink = document.getElementById("product-audio").value;

        if (!imageLink || !nameProduct || !nameArtist || !releaseDate || !album || !time || !audioLink ) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const product = { nameProduct, imageLink, nameArtist, releaseDate, album, time, audioLink, createdBy: user.username };

        console.log("Saving product:", product);

        if (user.role === "artist") {
            let pendingProducts = JSON.parse(localStorage.getItem("pendingProducts")) || [];
            pendingProducts.push(product);
            localStorage.setItem("pendingProducts", JSON.stringify(pendingProducts));
            alert("Sản phẩm đã gửi chờ duyệt!");
        } else {
            if (id) {
                allProducts[id] = product;
            } else {
                allProducts.push(product);
            }
            localStorage.setItem("products", JSON.stringify(allProducts));
            renderAdminProducts();
            renderPopular(document.getElementById("popular"), allProducts);
        }

        clearForm();
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Có lỗi xảy ra khi lưu sản phẩm!");
    }
}

//Render danh sách duyệt sản phẩm
function renderPendingProducts(pendingProducts) {
    const pendingTable = document.getElementById("pending-table");
    pendingTable.innerHTML = pendingProducts.map((product, index) => `
        <tr class="bg-gray-800 text-white">
            <td class="p-2 w-16 text-center">${index + 1}</td>
            <td class="p-2 w-24 text-center">
                <div class="flex justify-center">
                    <img src="${product.imageLink}" alt="Hình ảnh" width="50" height="50" class="rounded-lg">
                </div>
            </td>
            <td class="p-2 w-32 break-words">${product.nameProduct}</td>
            <td class="p-2 w-32 break-words">${product.nameArtist}</td>
            <td class="p-2 w-32 text-center">${product.releaseDate || 'N/A'}</td>
            <td class="p-2 w-48">${product.album || 'N/A'}</td>
            <td class="p-2 w-24 text-center">${product.time || 'N/A'}</td>
            <td>
                <button onclick="approveProduct(${index})" class="bg-green-500 text-white px-4 py-2 rounded-lg">Duyệt</button>
                <button onclick="rejectProduct(${index})" class="bg-red-500 text-white px-4 py-2 rounded-lg">Xóa</button>
            </td>
        </tr>
    `).join('');
}

//Cập nhật danh sách sau khi duyệt
function approveProduct(index) {
    let pendingProducts = JSON.parse(localStorage.getItem("pendingProducts")) || [];
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];

    if (index < 0 || index >= pendingProducts.length) {
        console.error("Index không hợp lệ.");
        return;
    }

    let approvedProduct = pendingProducts.splice(index, 1)[0]; // Lấy sản phẩm được duyệt
    allProducts.push(approvedProduct); // Thêm vào danh sách sản phẩm chính

    // Cập nhật lại localStorage
    localStorage.setItem("pendingProducts", JSON.stringify(pendingProducts));
    localStorage.setItem("products", JSON.stringify(allProducts));

    // Render lại danh sách
    renderPendingProducts(pendingProducts);  // Cập nhật danh sách sản phẩm chờ duyệt
    renderAdminProducts(allProducts);        // Cập nhật danh sách sản phẩm admin
}

//xóa sản phẩm đang chờ duyệt
function rejectProduct(index) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        let pendingProducts = JSON.parse(localStorage.getItem("pendingProducts")) || [];
        pendingProducts.splice(index, 1);

        localStorage.setItem("pendingProducts", JSON.stringify(pendingProducts));
        renderPendingProducts(pendingProducts);
    }
}


//Xóa sản phẩm trong ds sản phẩm
function clearForm() {
    document.getElementById("edit-id").value = "";
    document.getElementById("product-image").value = "";
    document.getElementById("product-name").value = "";
    document.getElementById("product-artist").value = "";
    document.getElementById("product-date").value = "";
    document.getElementById("product-albums").value = "";
    document.getElementById("product-time").value = "";
    document.getElementById("product-audio").value = "";
}
function deleteProduct(index) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        allProducts.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(allProducts));
        renderAdminProducts();
        renderPopular(document.getElementById("popular"), allProducts);
    }
}

//Sửa sản phẩm
function editProduct(index) {
    const product = allProducts[index];
    document.getElementById("edit-id").value = index;
    document.getElementById("product-image").value = product.imageLink || "";
    document.getElementById("product-name").value = product.nameProduct || "";
    document.getElementById("product-artist").value = product.nameArtist || "";
    document.getElementById("product-date").value = product.releaseDate || "";
    document.getElementById("product-albums").value = product.album || "";
    document.getElementById("product-time").value = product.time || "";
    document.getElementById("product-audio").value = product.rank || "";
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


//Đăng xuất
function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login/";
}

function downloadSong(index) {
    const song = allProducts.Popular[index];

    if (!song.audioLink) {
        alert("Bài hát này không có đường dẫn tải xuống!");
        return;
    }

    fetch(song.audioLink)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${song.nameProduct}.mp3`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error("Lỗi tải bài hát:", error);
            alert("Không thể tải bài hát, vui lòng thử lại sau.");
        });
}


window.onload = loadProducts;