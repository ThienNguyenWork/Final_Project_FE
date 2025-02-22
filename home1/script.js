// Load dữ liệu từ products.json
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const { weeklyTopSongs, newReleaseSongs, trendingSongs } = await response.json();

        // ✅ Giới hạn 5 sản phẩm cho mỗi danh sách
        renderProducts(document.getElementById('product-list'), weeklyTopSongs.slice(0, 5));
        renderProducts(document.getElementById('new-release-list'), newReleaseSongs.slice(0, 5));
        renderTrending(document.getElementById('trending-list'), trendingSongs.slice(0, 5));
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

// Render card sản phẩm cho Weekly Top & New Release
function renderProducts(container, products) {
    container.innerHTML = products.map(product => `
        <div class="card shadow-lg rounded-2xl overflow-hidden p-4 w-48">
            <img class="w-full rounded-xl h-36 object-cover" src="${product.imageLink}" alt="${product.nameProduct}" />
            <div class="px-4 pt-4 pb-1 flex items-center justify-between">
                <h2 class="mt-3 text-xl font-semibold text-white">${product.nameProduct}</h2>
            </div>
            <div class="px-2 pb-1 flex items-center justify-between">
                <span class="px-2 pb-0 text-white text-xs">${product.nameArtist}</span>
                <i class="fa-solid fa-music text-[#ee10b0]"></i>
            </div>
        </div>
    `).join('');
}

// Render danh sách Trending Songs
function renderTrending(container, trendingSongs) {
    container.innerHTML = trendingSongs.map(song => `
        <div class="grid grid-cols-12 items-center bg-gray-900 px-4 py-3 rounded-lg shadow-lg">
            <!-- Ranking -->
            <div class="col-span-1">
                <span class="text-white font-bold text-xl">#${song.rank}</span>
            </div>

            <!-- Ảnh và thông tin bài hát -->
            <div class="col-span-3 flex items-center gap-4">
                <img class="w-14 h-14 rounded-lg object-cover" src="${song.imageLink}" alt="${song.nameProduct}" />
                <div>
                    <h2 class="text-base text-white font-semibold leading-snug">${song.nameProduct}</h2>
                    <p class="text-xs text-gray-400">${song.nameArtist}</p>
                </div>
            </div>

            <!-- Ngày phát hành -->
            <div class="col-span-2 text-center">
                <span class="text-sm text-gray-400">${song.releaseDate}</span>
            </div>

            <!-- Album -->
            <div class="col-span-4 truncate">
                <span class="text-sm text-gray-400">${song.album}</span>
            </div>


            <!-- Icon trái tim -->
            <div class="col-span-1 text-center">
                <i class="fa-regular fa-heart text-[#ee10b0] cursor-pointer"></i>
            </div>
            
            <!-- Thời gian -->
            <div class="col-span-1 text-center">
                <span class="text-sm text-gray-400">${song.time}</span>
            </div>
        </div>
    `).join('');
}

// Gọi hàm khi trang được load
window.onload = loadProducts;
