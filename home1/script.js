async function loadProducts() {
    try {
        // Fetch file JSON (đảm bảo file này có trong thư mục)
        const response = await fetch('products.json');
        const products = await response.json();

        // Chọn container để hiển thị sản phẩm
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        // Hiển thị 5 sản phẩm đầu tiên
        products.slice(0, 5).forEach(product => {
            const productCard = `
                <div class="card shadow-lg rounded-2xl overflow-hidden p-4 w-48">
                    <img class="w-full rounded-xl h-36 object-cover" src="${product.imageLink}" alt="${product.nameProduct}" />
                    <div class="px-4 pt-4 pb-1 flex items-center space-x-2 justify-between">
                        <h2 class="mt-3 text-xl font-semibold text-white">${product.nameProduct}</h2>
                    </div>
                    <div class="px-2 pb-1 flex items-center justify-between">
                        <span class="px-2 pb-0 text-white text-xs">${product.nameArtist}</span>
                        <i class="fa-solid fa-music text-[#ee10b0]"></i>
                    </div>
                </div>
            `;
            productList.innerHTML += productCard;
        });
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

// Gọi hàm khi trang load xong
window.onload = loadProducts();
